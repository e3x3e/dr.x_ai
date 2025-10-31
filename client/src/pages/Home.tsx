import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, MessageCircle } from "lucide-react";
import { APP_LOGO, APP_TITLE, getLoginUrl } from "@/const";
import { useLocation } from 'wouter';

export default function Home() {
  const { user, loading, isAuthenticated, logout } = useAuth();
  const [, navigate] = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center max-w-md">
          <h1 className="text-4xl font-bold mb-4 text-gray-900">Dr.X AI Chat</h1>
          <p className="text-gray-600 mb-8">
            مساعد ذكي متقدم يساعدك في الإجابة على أسئلتك وحل مشاكلك
          </p>
          <Button 
            onClick={() => window.location.href = getLoginUrl()}
            className="w-full bg-blue-600 hover:bg-blue-700 text-lg py-6"
          >
            تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            مرحبا {user?.name || 'المستخدم'}
          </h1>
          <p className="text-xl text-gray-600">
            اختر إحدى الخيارات أدناه للبدء
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
            <MessageCircle className="w-12 h-12 text-blue-600 mb-4" />
            <h2 className="text-2xl font-bold mb-4 text-gray-900">محادثة ذكية</h2>
            <p className="text-gray-600 mb-6">
              تحدث مع مساعد Dr.X الذكي واحصل على إجابات فورية وشاملة
            </p>
            <Button 
              onClick={() => navigate('/chat')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              ابدأ المحادثة
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
