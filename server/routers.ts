import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  ai: router({
    getModels: publicProcedure.query(() => {
      return [
        {
          id: 'dr.x_chat',
          name: 'Dr.X Chat',
          description: 'النموذج الأساسي للمهام اليومية والاستفسارات العامة',
        },
        {
          id: 'dr.x_r1',
          name: 'Dr.X R1',
          description: 'النموذج المتقدم للتفكير المعقد والتحليل الشامل',
        },
      ];
    }),
    sendMessage: protectedProcedure
      .input(
        z.object({
          message: z.string().min(1),
          model: z.string(),
          conversationHistory: z.array(
            z.object({
              role: z.enum(['user', 'assistant']),
              content: z.string(),
            })
          ).optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        try {
          const messages = [
            ...(input.conversationHistory || []),
            { role: 'user' as const, content: input.message },
          ];

          const response = await invokeLLM({
            messages: messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
          });

          const content =
            response.choices?.[0]?.message?.content || 'عذراً، حدث خطأ في المعالجة';

          return {
            content,
            model: input.model,
            timestamp: new Date(),
          };
        } catch (error) {
          console.error('AI Error:', error);
          throw new Error('فشل في معالجة الرسالة');
        }
      }),
  }),
});

export type AppRouter = typeof appRouter;
