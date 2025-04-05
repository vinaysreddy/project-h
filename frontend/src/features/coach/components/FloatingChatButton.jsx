import React, { useState } from 'react';
import { Bot, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import AICoach from '../AICoach';

const FloatingChatButton = ({ userData, healthMetrics, activeTab }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg bg-gradient-to-br from-[#4D55CC] to-[#3E7B27] hover:shadow-xl transition-all z-50"
        aria-label="Chat with AI Coach"
      >
        <Bot className="h-6 w-6 text-white" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] p-0 h-[80vh] max-h-[700px]">
          <div className="flex flex-col h-full">
            <div className="p-4 flex items-center justify-between border-b bg-gradient-to-r from-[#4D55CC]/10 to-[#3E7B27]/10">
              <div className="flex items-center">
                <div className="bg-gradient-to-br from-[#4D55CC] to-[#3E7B27] p-2 rounded-full text-white mr-3">
                  <Bot className="h-5 w-5" />
                </div>
                <h2 className="font-medium">RIA Health Coach</h2>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex-1 overflow-hidden">
              <AICoach 
                userData={userData} 
                healthMetrics={healthMetrics} 
                contextHint={activeTab}
                hideHeader={true}
              />
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default FloatingChatButton;