import toast from 'react-hot-toast';
import Swal from 'sweetalert2';
import WarningIcon from '../components/Icons/WarningIcon';
// import WarningIcon from '../components/Icons/WarningIcon';

export const toastSuccess = (successMessage) => {
  toast.success(successMessage);
};

export const toastWarning = (warningMessage) => {
  toast(() => (
    <div className='flex items-center gap-x-2 '>
      <span className='text-yellow-400'>
        <WarningIcon />
      </span>
      {warningMessage}
    </div>
  ));
  // toast(warningMessage);
};

export const toastError = (errorMessage) => {
  toast.error(errorMessage);
};

export const removeAlert = () => {
  return Swal.fire({
    title: "Are you sure?",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, delete it!"
  })
};