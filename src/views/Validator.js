import validator from 'validator';

class Validator{
    constructor(validacoes){
        this.validacoes = validacoes;
    }

    validatingForm(state){
        let validacao = this.valido();

        this.validacoes.forEach(rule => {
            const fieldValue = state[rule.campo.toString()];
            const args = rule.args || [];
            const validationMethod = typeof rule.metodo === 'string' ? validator[rule.metodo] : rule.metodo;

            if(validationMethod(fieldValue, ...args, state) !== rule.validoQuando){
                validacao[rule.campo] = {
                    isInvalid: true,
                    message: rule.mensagem
                }

                validacao.isValid = false;
            }
        });

        return validacao;
    }

    valido(){
        const validacao = {};

        this.validacoes.map(rule => (
            validacao[rule.campo] = {isInvalid: false, message: ''}
        ));

        return {isValid: true, ...validacao};
    }    
}

export default Validator;