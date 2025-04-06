import { Separator } from "@/components/ui/separator";

interface CartSummaryProps {
  subtotal: number;
  taxes: number;
  shipping: number;
  total: number;
}

export function CartSummary({ subtotal, taxes, shipping, total }: CartSummaryProps) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between">
        <span className="text-neutral-600 dark:text-neutral-400">Subtotal</span>
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          ${subtotal.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-600 dark:text-neutral-400">Impuestos</span>
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          ${taxes.toFixed(2)}
        </span>
      </div>
      <div className="flex justify-between">
        <span className="text-neutral-600 dark:text-neutral-400">Envío</span>
        <span className="font-medium text-neutral-800 dark:text-neutral-200">
          ${shipping.toFixed(2)}
        </span>
      </div>
      <Separator className="my-2" />
      <div className="flex justify-between">
        <span className="font-medium text-lg text-neutral-800 dark:text-white">Total</span>
        <span className="font-bold text-lg text-neutral-900 dark:text-white">
          ${total.toFixed(2)}
        </span>
      </div>
    </div>
  );
}
