function Gameboard()
{
    const board = [];
    for(let i=0; i<9; i++)
    {
        board.push(Casa());
    }
    const getBoard = () => board;

    const markCasa = (indice, jogador) =>
    {
        if(board[indice].getValor() === null)
        {
            board[indice].mark(jogador);
            return true; //marcou a casa
        }
        else
        {
            return false; //casa já ocupada
        }
    };

    const printBoard = () =>
    {
        const boardComValoresDeCasas = board.map((casa) => casa.getValor());
        console.log(boardComValoresDeCasas);
    };

    const resetBoard = () =>
    {
        for (let i=0; i<9; i++)
        {
            board[i] = Casa();
        }
    }

    const cheio = () =>
    {
        return board.every(casa => casa.getValor() !== null);
    }

    return { getBoard, markCasa, printBoard, resetBoard, cheio };
}

function Casa()
{
    let valor = null;

    const mark = (jogador) =>
    {
        if(valor === null)
        {
            valor = jogador;
        }
    };
    
    const getValor = () => valor; //null, X ou O

    return { mark, getValor };
}

function GameController(jogadorUmNome = "X", jogadorDoisNome= "O")
{
    const board = Gameboard();
    const jogadores =
    [
        { nome: jogadorUmNome, token: 'X' },
        { nome: jogadorDoisNome, token: 'O' }
    ];
    
    let jogadorAtivo = jogadores[0];
    let isGameOver = false;

    const trocarTurno = () =>
    {
        //jogadorAtivo === jogadores[0] ? jogadores[1] : jogadores[0]: se o jogador ativo for o 0, ele passa a ser o 1, se não for o 0, ele vira o 0
        //isso alterna entre os jogadores 0 e 1
        jogadorAtivo = jogadorAtivo === jogadores[0] ? jogadores[1] : jogadores[0]; 
    };

    const getJogadorAtivo = () => jogadorAtivo;
    const isGameFinished = () => isGameOver;

    const printNovoRound = () =>
    {
        board.printBoard();
        console.log(`Turno de ${getJogadorAtivo().nome}.`);
    };

    const checkVencedor = () =>
    {
        const boardEstado = board.getBoard();
        const winConditions =
        [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Linhas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colunas
            [0, 4, 8], [2, 4, 6], // Diagonais
        ];

        for (const [a, b, c] of winConditions)
        {
            if(boardEstado[a].getValor() && boardEstado[a].getValor() === boardEstado[b].getValor() && boardEstado[a].getValor() === boardEstado[c].getValor())
            {
                return true; // Temos um vencedor
            }
        }
        return false; // Sem vencedor
    };

    const jogarRound = (indice) =>
    {
        if (isGameOver)
        {
            console.log("O jogo já acabou. Pls, reinicie pra jogar de novo.");
            return;
        }

        console.log(`${getJogadorAtivo().nome} marcou no espaço ${indice}...`);

        const casaMarcada = board.markCasa(indice, getJogadorAtivo().token);

        if (!casaMarcada)
        {
            console.log("Casa ocupada! Tente outra.");
            return;
        }
        
        if (board.cheio())
        {
            console.log("Empatou o jogo!");
            isGameOver = true;
            return "Empatou o jogo!";
        }

        if (checkVencedor())
        {
            console.log(`${getJogadorAtivo().nome} venceu!`);
            isGameOver = true;  // Marca o fim do jogo
            return `${getJogadorAtivo().nome} venceu!`;  // Retorna quem venceu
        }

        trocarTurno();
        printNovoRound();
    };

    const resetJogo = () =>
    {
        isGameOver = false;
        jogadorAtivo = jogadores[0];
        board.resetBoard();
        console.log("Jogo reiniciado!");
        printNovoRound();
    };

    return{
        jogarRound,
        getJogadorAtivo,
        resetJogo,
        isGameFinished,
        getBoard: board.getBoard
    };
}

function ControladorTela()
{
    const game = GameController();
    const divTurnoJogador = document.querySelector('.turn');
    const divBoard = document.querySelector('.board');

    const atualizarTela = () =>
    {
        divBoard.textContent = "";
        
        const board = game.getBoard();
        const jogadorAtivo = game.getJogadorAtivo();

        if(game.isGameFinished())
        {
            const resultado = divTurnoJogador.textContent;
            divTurnoJogador.textContent = resultado;
        }
        else
        {
            divTurnoJogador.textContent = `Turno de ${jogadorAtivo.nome}...`;
        }

        board.forEach((casa, indice) =>
        {
            const casaButton = document.createElement("button");
            casaButton.classList.add("casa");
            casaButton.dataset.indice = indice;

            const casaValor = casa.getValor();
            if (casaValor === 'X')
            {
                casaButton.textContent = 'X';  // Jogador 1 = X
            }
            else if (casaValor === 'O')
            {
                casaButton.textContent = 'O';  // Jogador 2 = O
            }
            else
            {
                casaButton.textContent = '';   // Células vazias
            }
            divBoard.appendChild(casaButton);
        });
    };

    function clickHandlerBoard(e)
    {
        const casaSelecionada = e.target.dataset.indice;
        if(!casaSelecionada || game.isGameFinished()) return;

        const resultado = game.jogarRound(parseInt(casaSelecionada));

        if(resultado)
        {
            divTurnoJogador.textContent = resultado; //msg de vitoria
        }
        atualizarTela();
    }

    divBoard.addEventListener("click", clickHandlerBoard);

    const restartButton = document.createElement("button");
    restartButton.textContent = "Reinicie";
    restartButton.classList.add("restart-btn");
    restartButton.addEventListener("click", () =>
    {
        game.resetJogo();
        atualizarTela();
    });
    document.body.appendChild(restartButton);
    atualizarTela();
}

ControladorTela();