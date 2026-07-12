//src/components/shared/form/AppSubmitButton.tsx
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';
import React from 'react';

type AppSubmitButtonProps = {
    isPending : boolean;
    children : React.ReactNode;
    pendingLabel ?: string;
    className ?: string;
    disabled ?: boolean;
}


const AppSubmitButton = ({
    isPending,
    children,
    pendingLabel = "Submitting...",
    className,
    disabled = false,
} : AppSubmitButtonProps
) => {

    const isDisabled = disabled || isPending;

  return (
    <button 
        type='submit'
        disabled={isDisabled} 
        className={cn("btn w-full cursor-pointer flex items-center justify-center gap-2", className)}
    >
      {isPending ? (
        <>
            <Loader2 className="animate-spin h-4 w-4" aria-hidden="true"/>
            {pendingLabel ? pendingLabel : children}
        </>
      ) : children
      }
    </button>
  )
}

export default AppSubmitButton