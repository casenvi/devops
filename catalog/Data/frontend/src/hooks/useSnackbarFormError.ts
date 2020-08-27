import { useSnackbar } from "notistack"
import { useEffect } from "react";


const useSnackbarFormError = (submitCount, errors) => {
    const {enqueueSnackbar} = useSnackbar();
    useEffect( () => {
        const hasError = Object.keys(errors).length !== 0;
        if (submitCount > 0 && hasError){
           enqueueSnackbar(
                'Formulário inválido. Verifique os campos destacados.',
                {variant: 'error'}
            )
        }
    }, [submitCount, enqueueSnackbar, errors])
};
export default useSnackbarFormError;