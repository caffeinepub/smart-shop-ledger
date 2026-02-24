import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Mail } from 'lucide-react';
import { SiFacebook } from 'react-icons/si';
import { useLanguage } from '../contexts/LanguageContext';

interface DeveloperInfoModalProps {
  open: boolean;
  onClose: () => void;
}

export default function DeveloperInfoModal({ open, onClose }: DeveloperInfoModalProps) {
  const { language } = useLanguage();

  const contactLabel = language === 'bn' ? 'অ্যাপ তৈরির জন্য যোগাযোগ করুন:' : 'For app development inquiries, contact:';
  const facebookLabel = language === 'bn' ? 'ফেসবুক পেজ' : 'Facebook Page';
  const appDescTitle = language === 'bn' ? 'অ্যাপ বিবরণ' : 'App Description';

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) onClose(); }}>
      <DialogContent className="mx-4 max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-center text-xl font-bold">
            MADE BY MD JAHID HASAN RUBEL
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-muted-foreground">
            Developer Information
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-2">
          <div className="space-y-5 py-2">
            {/* Contact Email */}
            <div className="flex items-start gap-3 rounded-xl border border-border bg-secondary/30 p-4">
              <Mail className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
              <div>
                <p className="text-sm font-medium text-muted-foreground">{contactLabel}</p>
                <a
                  href="mailto:mdjahidhasanrubel73@gmail.com"
                  className="break-all text-sm font-semibold text-primary hover:underline"
                >
                  mdjahidhasanrubel73@gmail.com
                </a>
              </div>
            </div>

            {/* App Description */}
            <div className="space-y-3">
              <h3 className="text-base font-bold text-foreground">{appDescTitle}</h3>
              <div className="space-y-3 text-sm leading-relaxed text-muted-foreground">
                <p>
                  This application was developed with the goal of providing users with a simple, modern, and user-friendly digital experience. In today's fast-paced world, people prefer apps that are lightweight, fast, and easy to navigate. Keeping this in mind, this app has been carefully designed and developed to ensure smooth performance and a clean interface.
                </p>
                <p>
                  The primary purpose of this app is to deliver its services efficiently and without complications. The layout is structured in a way that even new users can easily understand and use all features without confusion.
                </p>
                <p>
                  This app was officially created in 2026 as a personal initiative driven by passion for technology and innovation. It reflects dedication, creativity, and the desire to build something meaningful and helpful for users.
                </p>
                <p>
                  Future updates will include additional features, improved performance, and enhanced security to provide an even better user experience.
                </p>
              </div>
            </div>

            {/* Facebook Button */}
            <a
              href="https://www.facebook.com/share/1Dp2y5fNHD/"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button
                className="w-full gap-2 bg-[#1877F2] text-white hover:bg-[#1565C0]"
                type="button"
              >
                <SiFacebook className="h-5 w-5" />
                {facebookLabel}
              </Button>
            </a>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
