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

interface BoostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  valueDestinations: Array<{
    name: string;
    type: string;
    address: string;
    split: number;
  }>;
  feedUrl?: string;
  episodeGuid?: string;
  totalAmount?: number;
  contentTitle?: string;
  feedId?: string;
  episodeId?: string;
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

export function BoostModal({
  open,
  onOpenChange,
  valueDestinations,
  feedUrl,
  episodeGuid,
  totalAmount = 1000,
  contentTitle = 'Content',
  feedId,
  episodeId
}: BoostModalProps) {
  const [amount, setAmount] = useState(totalAmount.toString());
  const [message, setMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();
  const { userName, setUserName } = useUserName();
  const wallet = useLightningWallet();

  const totalSplit = valueDestinations.reduce((sum, dest) => sum + dest.split, 0);
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

      // Add content info if available
      if (contentTitle) {
        customRecords['7629169'] = (customRecords['7629169'] || '') + ` | ${contentTitle}`;
      }

      // Send payment to each recipient based on their split
      for (const destination of valueDestinations) {
        const recipientAmount = Math.floor((amountSats * destination.split) / 100);
        if (recipientAmount > 0) {
          await wallet.keysend?.({
            destination: destination.address,
            amount: recipientAmount,
            customRecords
          });
        }
      }

      toast({
        title: 'Payment Sent!',
        description: `Successfully sent ${amount} sats to ${valueDestinations.length} recipient${valueDestinations.length > 1 ? 's' : ''}`,
      });

      onOpenChange(false);
      setAmount(totalAmount.toString());
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
  }, [wallet, amount, message, userName, valueDestinations, isValidSplit, contentTitle, toast, onOpenChange, totalAmount]);

  const recipientCount = valueDestinations.length;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
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
              Recipients ({recipientCount})
            </Label>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {valueDestinations.map((destination, index) => (
                <div key={index} className="flex justify-between text-sm p-2 bg-muted rounded">
                  <span className="font-medium">{destination.name}</span>
                  <span className="text-muted-foreground">{destination.split}%</span>
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