import { ComponentProps } from 'react';
import cx from 'classnames';
import {Button} from 'react-bootstrap';

interface Props extends ComponentProps<'button'>{
  icon?: React.ReactNode;
  className?: string;
  variant: string;
  loading: boolean;
  undo: number;
  sendDataStatusUndo: (status: number) => void;
}
export default function Save({ loading, icon, className, variant, children, sendDataStatusUndo, undo, ...props }: Props) {
  const classNames = cx(
    'flex items-center',
    'focus:outline-none',
    {
      'pointer-events-none bg-opacity-75 select-none': loading
    },
    className
  );
  return (
    <Button
      className={className}
      type="submit"
      tabIndex={-1}
      variant={variant}
      form="my-form"
      disabled={loading}  
      // {...props}
      onClick={() => !loading && sendDataStatusUndo(undo)}
    >
      <div className="d-flex gap-2 align-items-center">
        {loading && <div className="mr-2 btn-spinner" />}
        {!loading && <div className={!loading ? 'w-auto pr-2' : 'd-none'}>
          {icon}
        </div>}
        <span> {children}</span>
      </div>
    </Button>
    // <button

    // >
    //   <div className="d-flex gap-2 align-items-center">
    //     {loading && <div className="mr-2 btn-spinner" />}
    //     {!loading && <div className={!loading ? 'w-auto pr-2' : 'd-none'}>
    //       {icon}
    //     </div>}
    //     <span> {children}</span>
    //   </div>
    // </button>
  );
}
