import React from "react";

import {
  Input,
  Button,
  Col
} from "reactstrap";

import { Link } from 'react-router-dom';

import Header from "./components/Header";

class StarterTerm extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            terms : '0',
            checkValid: false,
        }
        this.handleCheckbox = this.handleCheckbox.bind(this);
    }

    componentDidMount() {
        sessionStorage.clear();
    }
    
    handleCheckbox() {
        this.setState(prevState => ({
            checkValid : !prevState.checkValid
        }));
    }
    accept()
    {
        sessionStorage.setItem('accepted', true);
    }
    render () {
        return(
            <div>
            <Header/>
            <Col sm="50" md={{ size: 8, offset: 2 }} className="text-justify">
            <p className= " text-center font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '25px'}}>Termo de Consentimento Livre e Esclarecido</p>
            <br/>
            <p className= " text-justify font-weight-bold " style={{fontFamily: 'Calibri', fontSize: '20px'}}>Leia atentamente o formulário de consentimento abaixo e comece a participar do estudo se você concorda com os termos de consentimento.</p>
            <br/>
            <p className= " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}> 
            Você está sendo convidado a participar de uma pesquisa de opinião. O objetivo desta pesquisa é avaliar quais informações dos estudantes, apresentadas através de diferentes painéis de dados, melhor auxilia o professor no processo de tomada de decisão durante o ensino/aprendizagem em uma plataforma de ensino gamificada. 
            </p>
            <br/>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
              <strong> Título do Estudo: </strong> Avaliação de diferentes painéis de dados para o auxílio de professores no processo de tomada de decisão em Ambientes Educacionais Gamificados.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
              <strong> Pesquisadores: </strong> 
              <ul>
                <li className = " text-justify "> Kamilla Tenório (kktas@ic.ufal.br)</li>
                <li className = " text-justify "> Diego Dermeval (diego.matos@famed.ufal.br)</li>
                <li className = " text-justify "> Alexandre Machado (alexandretopeca@gmail.com)</li>
                <li className = " text-justify "> Bruno Lemos (bruno.lemos.ec@gmail.com)</li>
                <li className = " text-justify "> Pedro Henrique (phbn@ic.ufal.br)</li>
                <li className = " text-justify "> Rodrigo Santos (rss3@ic.ufal.br)</li>
              </ul>
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Finalidade e Procedimento: </strong>A finalidade desta pesquisa de opinião é avaliar, no ponto de vista do professor, quais informações dos estudantes melhor o auxilia  no processo de tomada de decisão durante o ensino/aprendizagem em uma plataforma de ensino gamificada. Com intuito de alcançar o objetivo da pesquisa, três painéis com diferentes dados dos estudantes serão analisados. O primeiro painel terá informações apenas da interação dos estudantes com os recursos de aprendizagem do sistema. O segundo painel terá apenas informações da interação dos estudantes com os elementos de gamificação do sistema. E por fim, o terceiro painel terá informações relacionada tanto a interação dos alunos com os recursos de aprendizagem quanto com com os elementos de gamificação do sistema gamificado. Portanto, a sua participação nesta pesquisa consistirá na realização das seguintes atividades: <br/><br/>
                <ul>
                    <li className = " text-justify ">
                    Primeiro, você irá responder um questionário demográfico, onde deve ser informado seu gênero, idade, nível educacional que leciona e estado onde mora, assim como seu nível de habilidade técnica em relação ao uso de tecnologias de informação. 
                    </li>
                    <li className = " text-justify ">
                    Segundo, você irá visualizar os 3 diferentes painéis de dados em ordem aleatória. Após a visualização de cada um dos painéis, você irá responder a um questionário com 9 perguntas, cujo o objetivo é avaliar sua compreensão, utilidade percebida e mudanças comportamentais em relação aos diferentes painéis. 
                    </li>
                </ul>
            </p>
            <br/>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Potenciais Benefícios: </strong> Os resultados da pesquisa de opinião podem contribuir para um melhor entendimento de quais dados dos estudantes melhor apoia o processo de tomada de decisão de professores em um ambiente educacional gamificado.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Potenciais Riscos: </strong> Não há riscos conhecidos neste estudo.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Confidencialidade: </strong> Ao participar deste estudo, você reconhece e concorda que suas respostas e contribuições serão registradas anonimamente para fins de análise de dados mais confiáveis.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Disseminação dos Resultados: </strong> Os resultados agregados deste estudo aparecerão em artigos publicados em conferências revisadas por pares e revistas científicas nacionais e internacionais.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Direito de Retirada: </strong> A participação neste estudo é voluntária, e você pode decidir não participar a qualquer momento, ou optar por não responder a perguntas com as quais não se sinta confortável. As respostas da pesquisa permanecerão anônimas. Uma vez que a pesquisa é anônima, quando é submetida, não pode ser removida.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Dúvidas: </strong> Se você tiver alguma dúvida sobre o estudo, não hesite em perguntar a qualquer momento. Você também está livre para entrar em contato com os pesquisadores se você tiver dúvidas no futuro. Este estudo não precisa ser submetido ao comitê de ética, pois ele está avaliando apenas recursos para melhorar o software desenvolvido.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Acompanhamento: </strong> Se você tiver interesse em saber os resultados deste estudo, você pode contatar os pesquisadores usando as informações de contato fornecidas acima.
            </p>
            <p className = " text-justify " style={{fontFamily: 'Calibri', fontSize: '20px'}}>
                <strong> Consentimento para Participar: </strong> Ao preencher e submeter este questionário, o seu consentimento livre e esclarecido é implícito e indica que você entende as condições acima de participação neste estudo.
            </p>
            <br/>
            <Input type="checkbox" style={{position: 'relative', margin: '0 0.5em 0 0'}} onChange={this.handleCheckbox}/> 
            Declaro que compreendi os objetivos, riscos e benefícios de minha participação na pesquisa e que concordo em participar.<br/><br/>
                {!this.state.checkValid ? 
                    <center>
                    <Button disabled={!this.state.checkValid } color ="#C0B283" type="submit"> 
                        Continuar
                    </Button>
                    </center>
                  :
                    <Link className="text-dark" to={{pathname:"/demographicquest"}} onClick = {this.accept}>
                        <center>
                        <Button color ="#C0B283" type="submit"> 
                            Continuar
                            </Button>
                        </center>
                    </Link> }
            <br/>
            </Col>
            </div>
        )
    }
}

export default StarterTerm;
