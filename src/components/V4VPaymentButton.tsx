import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/useToast';
import { useUserName } from '@/hooks/useUserName';
import { cn } from '@/lib/utils';
import { Zap, Send, Users, MessageSquare } from 'lucide-react';

interface V4VPaymentButtonProps {
  recipients: Array<{
    name: string;
    type: string;
    address: string;
    split: number;
  }>;
  episodeTitle?: string;
  podcastTitle?: string;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
  size?: 'default' | 'sm' | 'lg';
  showRecipientCount?: boolean;
}

// Lazy load the payment hook to reduce initial bundle size
const useLightningWallet = () => {
  const [walletHook, setWalletHook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only load the payment hook when the component mounts
    import('@/hooks/useLightningWallet').then((module) => {
      setWalletHook(() => module.useLightningWallet);
      setIsLoading(false);
    }).catch((error) => {
      console.error('Failed to load payment hook:', error);
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !walletHook) {
    return {
      connectWallet: async () => null,
      disconnectWallet: () => {},
      resetConnectionState: () => {},
      cancelConnection: () => {},
      isConnecting: false,
      isConnected: false,
      error: null,
      walletProvider: null,
      connectionAttemptInProgress: false
    };
  }

  return walletHook();
};

export function V4VPaymentButton({
  recipients,
  episodeTitle,
  podcastTitle,
  className,
  variant = 'default',
  size = 'default',
  showRecipientCount = true
}: V4VPaymentButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [amount, setAmount] = useState('1000'); // Default 1000 sats
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { userName, setUserName } = useUserName();
  const wallet = useLightningWallet();

  const totalSplit = recipients.reduce((sum, recipient) => sum + recipient.split, 0);
  const isValidSplit = totalSplit === 100;

  const handlePayment = useCallback(async () => {
    if (!isValidSplit) {
      toast({
        title: 'Invalid Payment Split',
        description: 'Total split must equal 100%',
        variant: 'destructive'
      });
      return;
    }

    if (!wallet.isConnected) {
      try {
        await wallet.connectWallet();
      } catch (error) {
        toast({
          title: 'Connection Failed',
          description: error instanceof Error ? error.message : 'Failed to connect wallet',
          variant: 'destructive'
        });
        return;
      }
    }

    setIsProcessing(true);

    try {
      const amountSats = parseInt(amount);
      if (isNaN(amountSats) || amountSats <= 0) {
        throw new Error('Invalid amount');
      }

      // Create custom records for the payment
      const customRecords: Record<string, string> = {};
      
      // Add sender name if provided
      if (userName.trim()) {
        customRecords['7629169'] = userName.trim(); // TLV type for sender name
      }
      
      // Add message if provided
      if (message.trim()) {
        customRecords['7629169'] = (customRecords['7629169'] || '') + (message.trim() ? ` - ${message.trim()}` : '');
      }

      // Add episode/podcast info if available
      if (episodeTitle || podcastTitle) {
        const contentInfo = [podcastTitle, episodeTitle].filter(Boolean).join(' - ');
        if (contentInfo) {
          customRecords['7629169'] = (customRecords['7629169'] || '') + ` | ${contentInfo}`;
        }
      }

      // Send payment to each recipient based on their split
      for (const recipient of recipients) {
        const recipientAmount = Math.floor((amountSats * recipient.split) / 100);
        if (recipientAmount > 0) {
          await wallet.keysend?.({
            destination: recipient.address,
            amount: recipientAmount,
            customRecords
          });
        }
      }

      toast({
        title: 'Payment Sent!',
        description: `Successfully sent ${amount} sats to ${recipients.length} recipient${recipients.length > 1 ? 's' : ''}`,
      });

      setIsOpen(false);
      setAmount('1000');
      setMessage('');

    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: 'Payment Failed',
        description: error instanceof Error ? error.message : 'Failed to send payment',
        variant: 'destructive'
      });
    } finally {
      setIsProcessing(false);
    }
  }, [wallet, amount, message, userName, recipients, isValidSplit, episodeTitle, podcastTitle, toast]);

  const recipientCount = recipients.length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant={variant}
          size={size}
          className={cn(
            'gap-2 transition-all duration-200 hover:scale-105',
            className
          )}
          onClick={() => setIsOpen(true)}
        >
          <Zap className="h-4 w-4" />
          Boost
          {showRecipientCount && recipientCount > 1 && (
            <div className="flex items-center gap-1 text-xs opacity-80">
              <Users className="h-3 w-3" />
              {recipientCount}
            </div>
          )}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-yellow-500" />
            Send Value4Value Payment
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Amount Input */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (sats)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="1000"
              min="1"
              className="text-right"
            />
          </div>

          {/* Sender Name */}
          <div className="space-y-2">
            <Label htmlFor="sender-name">Your Name (optional)</Label>
            <Input
              id="sender-name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Anonymous"
              maxLength={50}
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Message (optional)
            </Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Thanks for the great content!"
              maxLength={200}
              rows={3}
            />
          </div>

          {/* Recipients */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Recipients ({recipients.length})
            </Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {recipients.map((recipient, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <span className="font-medium">{recipient.name}</span>
                  <span className="text-muted-foreground">{recipient.split}%</span>
                </div>
              ))}
            </div>
            {!isValidSplit && (
              <p className="text-sm text-destructive">
                Warning: Total split is {totalSplit}% (should be 100%)
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button
              onClick={handlePayment}
              disabled={isProcessing || !isValidSplit || !wallet.isConnected}
              className="flex-1 gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send {amount} sats
                </>
              )}
            </Button>
            
            {!wallet.isConnected && (
              <Button
                variant="outline"
                onClick={wallet.connectWallet}
                disabled={wallet.isConnecting}
                className="gap-2"
              >
                {wallet.isConnecting ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4" />
                    Connect Wallet
                  </>
                )}
              </Button>
            )}
          </div>

          {/* Error Display */}
          {wallet.error && (
            <p className="text-sm text-destructive">{wallet.error}</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
} 