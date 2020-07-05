import Swal from 'sweetalert2';

const PopUp = {
  showMessage(status, msg) {
    if(status === 'success') {
      Swal.fire({
        icon: "success",
        text: msg,       
        timer: 2000
      })
    }

    if(status === 'error'){
      Swal.fire({
        icon: 'error',
        text: msg,
        confirmButtonText: 'Ok'        
      })
    }
  }
}

export default PopUp;