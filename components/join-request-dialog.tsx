"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/theme-context";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface JoinRequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  salon: {
    id: number;
    name: string;
    description: string;
    requiresApproval: boolean;
  } | null;
}

export function JoinRequestDialog({
  isOpen,
  onClose,
  salon,
}: JoinRequestDialogProps) {
  const { theme } = useTheme();
  const [joinRequestMessage, setJoinRequestMessage] = useState("");

  const handleJoinRequest = () => {
    if (!salon) return;
    
    // Validation du message
    if (!joinRequestMessage.trim()) {
      toast({
        title: "Message requis",
        description: "Veuillez saisir un message pour votre demande d'adhésion.",
        variant: "destructive",
      });
      return;
    }
    
    // Here you would typically send this request to your backend
    console.log(`Join request for ${salon.name}: ${joinRequestMessage}`);
    toast({
      title: "Demande d'adhésion envoyée",
      description: `Votre demande pour rejoindre le salon ${salon.name} a été envoyée à l'administrateur.`,
    });
    
    // Reset state
    setJoinRequestMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className={cn(
        "sm:max-w-md",
        theme === "light" ? "bg-white" : "bg-zinc-900 border-zinc-800"
      )}>
        <DialogHeader>
          <DialogTitle className={theme === "light" ? "text-gray-900" : "text-white"}>
            Demande d'adhésion
          </DialogTitle>
          <DialogDescription className={theme === "light" ? "text-gray-500" : "text-zinc-400"}>
            {salon && `Envoyez une demande pour rejoindre le salon #${salon.name}. Ce salon nécessite l'approbation d'un administrateur.`}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Textarea
              id="join-message"
              placeholder="Expliquez pourquoi vous souhaitez rejoindre ce salon et ce que vous pouvez y apporter..."
              value={joinRequestMessage}
              onChange={(e) => setJoinRequestMessage(e.target.value)}
              className={cn(
                "min-h-[120px]",
                theme === "light"
                  ? "bg-white border-gray-200 text-gray-900"
                  : "bg-zinc-800 border-zinc-700 text-white"
              )}
            />
            <p className={cn(
              "text-xs",
              theme === "light" ? "text-gray-500" : "text-zinc-400"
            )}>
              Soyez convaincant ! L'administrateur du salon évaluera votre demande.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            className={theme === "light" ? "border-gray-200 text-gray-700" : "border-zinc-700 text-white"}
          >
            Annuler
          </Button>
          <Button
            onClick={handleJoinRequest}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Envoyer la demande
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
