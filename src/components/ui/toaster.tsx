
import { useToast } from "@/hooks/use-toast"
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast"
import { CheckCircle, AlertCircle, Info } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        let Icon = Info;
        
        if (variant === "destructive") {
          Icon = AlertCircle;
        } else if (variant === "success") {
          Icon = CheckCircle;
        }
        
        return (
          <Toast key={id} {...props} variant={variant}>
            <div className="flex">
              {variant && (
                <div className="mr-3">
                  <Icon className={`h-5 w-5 ${
                    variant === "destructive" ? "text-destructive" : 
                    variant === "success" ? "text-green-500" : "text-primary"
                  }`} />
                </div>
              )}
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
