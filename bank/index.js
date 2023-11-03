const auxABI = [
    {
        inputs: [],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        inputs: [],
        name: 'getState',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'uint256',
                name: 'newState',
                type: 'uint256',
            },
        ],
        name: 'updateState',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const oraclearABI = [
    {
        inputs: [
            {
                internalType: 'address',
                name: 'aux',
                type: 'address',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'constructor',
    },
    {
        anonymous: false,
        inputs: [],
        name: 'NewRequest',
        type: 'event',
    },
    {
        inputs: [],
        name: 'MAXUINT',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'check',
        outputs: [
            {
                internalType: 'uint256',
                name: 'state',
                type: 'uint256',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
];

const Url = 'http://127.0.0.1:8545';

const express = require('express');
const { ethers } = require('ethers');
const Web3 = require('web3');

const web3 = new Web3('ws://127.0.0.1:8545');

// Configurações do servidor e do provider
const app = express();
const provider = new ethers.JsonRpcProvider(Url);

const auxiliarAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const oraclearAddress = '0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512';

// Conectando aos contratos usando ethers
const auxiliarContract = new ethers.Contract(auxiliarAddress, auxABI, provider);
const oraclearContract = new ethers.Contract(
    oraclearAddress,
    oraclearABI,
    provider
);

// Configuração para ler o corpo da requisição
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    const now = new Date();
    console.log(`[${now.toISOString()}] ${req.method} ${req.path}`);
    next(); // Continua para processar a rota
});

web3.eth
    .subscribe('pendingTransactions', function (error, result) {
        if (!error) {
            console.log(result);
        } else {
            console.error(error);
        }
    })
    .on('data', function (transactionHash) {
        web3.eth.getTransaction(transactionHash).then(function (transaction) {
            if (transaction.to === oraclearAddress) {
                // Uma transação pendente foi detectada chamando o contrato
                console.log('>>> [EVENT] Pending transaction:', transaction);
            }
        });
    });

// Configuração do ouvinte de eventos para o evento NewRequest
oraclearContract.on('*', (event) => {
    if (event.emitter.target === oraclearAddress) {
        console.log('>>> [EVENT] Completed transaction:', event.log.topics);
    }
});

const privateKey = '0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80';
const wallet = new ethers.Wallet(privateKey, provider);

// Rota para chamar updateState no contrato Auxiliar com timeout
app.post('/update-state', async (req, res) => {
    const { number } = req.body;

    try {
        const tx = await auxiliarContract.connect(wallet).updateState(number, {
            gasLimit: 9007199254740991 - 1,
            gasPrice: 0,
        });
        res.send({ tx: tx.hash });
    } catch (error) {
        console.error('Tx Error:', error);
        res.status(500).send('Erro ao enviar transação: ' + error.message);
    }
});

// Rota para chamar check no contrato Oraclear com timeout e retornar o resultado
app.get('/check', async (req, res) => {
    try {
        const tx = await oraclearContract.connect(wallet).check({
            gasLimit: 9007199254740991 - 1,
            gasPrice: 0,
        });
        res.json({ tx: tx.hash });
    } catch (error) {
        console.error("Error calling 'check' method:", error);
        res.status(500).send(error.toString());
    }
});

// Inicia o servidor
const PORT = 3033;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

