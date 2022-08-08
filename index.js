const { ApolloServer , gql } = require('apollo-server');

const usuarios = [
    {
        id: 1,
        nome: 'joaquim',
        email: 'joaquim@gmail.com',
        idade: 22,
        perfil_id: 1
    },
    {
        id: 2,
        nome: 'maria',
        email: 'maria123@gmail.com',
        idade: 56,
        perfil_id: 2
    },
    {
        id: 3,
        nome: 'marciel',
        email: 'marcielm@gmail.com',
        idade: 32,
        perfil_id: 2
    },
    {
        id: 4,
        nome: 'Ariel',
        email: 'arielm@gmail.com',
        idade: 32,
        perfil_id: 1
    }
]

const perfis = [
    {id: 1, nome: 'Administrador'},
    {id: 2, nome: 'Comum'}
]

const typeDefs = gql`

    scalar Date

    type Perfil {
        id: Int!
        nome: String!
    }

    type Usuario {
        id: Int
        nome: String!
        email: String!
        idade: Int
        salario: Float
        vip: Boolean
        perfil: Perfil
    }

    type Produto {
        nome: String!
        preco: Float!
        desconto: Float
        precoComDesconto: Float
    }    

    type Query  {
        teste: String
        hora: Date
        produto: Produto
        usuarios: [Usuario]
        usuario(id: Int): Usuario
        perfis: [Perfil]
        perfil(id: Int): Perfil
    }
`;



const resolvers = {
    Usuario: {
        salario(usuario) {
            return usuario.salario_real
        },
        perfil(usuario) {
            const selects = perfis.filter(p => p.id === usuario.perfil_id)
            return selects ? selects[0] : null
        }
    },
    Produto: {
        precoComDesconto(produto) {
            if(produto.desconto) {
                return produto.preco * (1 - produto.desconto)
            }
            return produto.preco
        }
    },
    Query: {
        teste () {
                return 'este aqui'           
            },
            hora() {
                return `${new Date}`
            },
            usuarios() {                
                return usuarios
            },
            usuario(_, { id }) {
                const selects = usuarios.filter(u => u.id === id)
                return selects ? selects[0] : null
            },
            perfis() {
                return perfis
            },
            perfil(_, { id }) {
                const selects = perfis.filter(p => p.id === id)
                return selects ? selects[0] : null
            }

    }
}
const {
    ApolloServerPluginLandingPageLocalDefault
} = require('apollo-server-core');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    csrfPrevention: true,
    cache: 'bounded',
});

server.listen().then(({url}) => {
    console.log(`Server ready in ${url}`);
});