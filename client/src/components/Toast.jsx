import React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

const iconMap = {
  success: <CheckCircle2 className="w-5 h-5 text-edu-green" />,
  error: <AlertCircle className="w-5 h-5 text-red-500" />,
  info: <Info className="w-5 h-5 text-edu-blue" />,
};

const ToastContainer = ({ toasts, dismissToast }) => {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-2 w-80">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 40 }}
            className="solid-card flex items-start gap-3 p-4"
          >
            {iconMap[toast.type] || iconMap.info}
            <p className="text-sm text-ink flex-1">{toast.message}</p>
            <button onClick={() => dismissToast(toast.id)} className="text-slate-400 hover:text-slate-600">
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastContainer;
