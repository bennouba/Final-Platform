import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Check,
  Copy,
  Download,
  Facebook,
  Instagram,
  Linkedin,
  Mail,
  MessageCircle,
  MessageSquare,
  Phone,
  Send,
  Share2,
  Twitter,
  Users
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ShareMenuProps {
  url: string;
  title?: string;
  className?: string;
  size?: "icon" | "sm" | "md" | "lg";
  variant?: "ghost" | "outline" | "default";
  showLabel?: boolean;
}

const ShareMenu: React.FC<ShareMenuProps> = ({ 
  url, 
  title = "شاهد هذا المنتج الرائع",
  className = "",
  size = "sm",
  variant = "ghost",
  showLabel = false
}) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {

    }
  };

  const shareOptions = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="h-6 w-6 text-green-600" />,
      url: `https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`,
      bgColor: 'bg-green-50 hover:bg-green-100',
      category: 'social'
    },
    {
      name: 'Telegram',
      icon: <Send className="h-6 w-6 text-blue-500" />,
      url: `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      category: 'social'
    },
    {
      name: 'Facebook', 
      icon: <Facebook className="h-6 w-6 text-blue-600" />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      category: 'social'
    },
    {
      name: 'Twitter',
      icon: <Twitter className="h-6 w-6 text-blue-400" />,
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      category: 'social'
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="h-6 w-6 text-blue-700" />,
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      bgColor: 'bg-blue-50 hover:bg-blue-100',
      category: 'social'
    },
    {
      name: 'Instagram',
      icon: <Instagram className="h-6 w-6 text-pink-600" />,
      url: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
      bgColor: 'bg-pink-50 hover:bg-pink-100',
      category: 'social'
    },
    {
      name: 'Gmail',
      icon: <Mail className="h-6 w-6 text-red-600" />,
      url: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(url)}`,
      bgColor: 'bg-red-50 hover:bg-red-100',
      category: 'apps'
    },
    {
      name: 'الرسائل',
      icon: <MessageSquare className="h-6 w-6 text-green-600" />,
      url: `sms:?&body=${encodeURIComponent(title + ' ' + url)}`,
      bgColor: 'bg-green-50 hover:bg-green-100',
      category: 'apps'
    },
    {
      name: 'جهات الاتصال',
      icon: <Users className="h-6 w-6 text-purple-600" />,
      action: 'contacts',
      bgColor: 'bg-purple-50 hover:bg-purple-100',
      category: 'apps'
    },
    {
      name: 'النسخ',
      icon: <Copy className="h-6 w-6 text-gray-600" />,
      action: 'copy',
      bgColor: 'bg-gray-50 hover:bg-gray-100',
      category: 'apps'
    }
  ];

  const handleShare = (option: any) => {
    if (option.action === 'copy') {
      handleCopyLink();
    } else if (option.action === 'contacts') {
      // محاولة فتح جهات الاتصال أو إظهار رسالة
      if (navigator.share) {
        navigator.share({
          title,
          url
        }).catch(() => {
          handleCopyLink();
        });
      } else {
        handleCopyLink();
      }
    } else {
      window.open(option.url, '_blank', 'noopener,noreferrer,width=600,height=500');
    }
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild onClick={(e: React.MouseEvent) => e.stopPropagation()}>
        <Button
          variant={variant}
          size={size}
          className={`${className} ${showLabel ? 'gap-2' : 'w-8 h-8 p-0'}`}
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <Share2 className="h-4 w-4" />
          {showLabel && "مشاركة"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="center" side="bottom" sideOffset={4}>
        <div className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <Share2 className="h-5 w-5 text-gray-600" />
            <span className="font-medium text-gray-900 text-lg">مشاركة المنتج</span>
          </div>

          {/* وسائل التواصل الاجتماعي */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">وسائل التواصل الاجتماعي</h3>
            <div className="grid grid-cols-3 gap-2">
              {shareOptions.filter(option => option.category === 'social').map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleShare(option)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200 ${option.bgColor} border hover:shadow-md hover:scale-105`}
                >
                  {option.icon}
                  <span className="text-xs font-medium text-gray-700 text-center">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* التطبيقات وجهات الاتصال */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-2">التطبيقات وجهات الاتصال</h3>
            <div className="grid grid-cols-2 gap-2">
              {shareOptions.filter(option => option.category === 'apps').map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleShare(option)}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${option.bgColor} border hover:shadow-md hover:scale-105`}
                >
                  {option.icon}
                  <span className="text-sm font-medium text-gray-700">{option.name}</span>
                </button>
              ))}
            </div>
          </div>

          {copied && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-green-600" />
                <p className="text-sm text-green-700 font-medium">تم نسخ الرابط بنجاح!</p>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ShareMenu;
