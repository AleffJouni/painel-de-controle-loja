<template>
  <div>
    <h1>Usuários</h1>
    <p>Gerencie os usuários da loja aqui.</p>

    <!-- Barra de Pesquisa -->
    <label for="search">Buscar Usuários:</label>
    <input
      id="search"
      type="text"
      v-model="searchQuery"
      placeholder="Digite o nome do usuário"
      @input="filterUsers"
    />

    <!-- Botão para adicionar novo usuário -->
    <button @click="addUser">Adicionar Usuário</button>

    <div v-if="loading">Carregando usuários...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Cidade</th>
            <th>Ações</th> <!-- Coluna para os botões -->
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in filteredUsers" :key="user.id">
            <td>
              {{ user.name?.firstname || 'N/A' }} {{ user.name?.lastname || 'N/A' }}
            </td>
            <td>{{ user.email || 'N/A' }}</td>
            <td>{{ user.address?.city || 'N/A' }}</td>
            <td>
              <button @click="editUser(user)">Editar</button>
              <button @click="removeUser(user.id)">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>

  <!-- Modal -->
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <h2>{{ modalType === 'add' ? 'Adicionar Usuário' : 'Editar Usuário' }}</h2>

      <form @submit.prevent="saveUser">
        <label for="firstname">Nome:</label>
        <input id="firstname" v-model="userForm.firstname" required />

        <label for="lastname">Sobrenome:</label>
        <input id="lastname" v-model="userForm.lastname" required />

        <label for="email">E-mail:</label>
        <input id="email" type="email" v-model="userForm.email" required />

        <label for="city">Cidade:</label>
        <input id="city" v-model="userForm.city" required />

        <button type="submit">{{ modalType === 'add' ? 'Adicionar' : 'Salvar' }}</button>
        <button type="button" @click="closeModal">Cancelar</button>
      </form>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Users',
  data() {
    return {
      users: [], // Lista completa de usuários
      filteredUsers: [], // Lista de usuários filtrados pela barra de busca
      searchQuery: '', // Termo de busca digitado pelo usuário
      showModal: false, // Controla a exibição do modal
      modalType: '', // Tipo de operação no modal ('add' ou 'edit')
      userForm: {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        city: '',
      }, // Dados do formulário no modal
      loading: true, // Indica se os dados estão sendo carregados
    };
  },
  async mounted() {
    try {
      // Requisição para buscar a lista de usuários
      const response = await api.get('/users');

      // Normaliza os dados para evitar erros
      this.users = response.data.map((user) => ({
        id: user.id,
        name: {
          firstname: user.name?.firstname || '',
          lastname: user.name?.lastname || '',
        },
        email: user.email || '',
        address: {
          city: user.address?.city || '',
        },
      }));
      this.filteredUsers = [...this.users];
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      this.loading = false;
    }
  },

  methods: {
    // Filtra os usuários com base no nome digitado na barra de busca
    filterUsers() {
      const query = this.searchQuery.toLowerCase();
      this.filteredUsers = this.users.filter((user) =>
        `${user.name.firstname} ${user.name.lastname}`
          .toLowerCase()
          .includes(query)
      );
    },

    // Abre o modal para adicionar um novo usuário
    addUser() {
      this.modalType = 'add';
      this.userForm = {
        id: null,
        firstname: '',
        lastname: '',
        email: '',
        city: '',
      };
      this.showModal = true;
    },

    // Abre o modal para editar os dados de um usuário existente
    editUser(user) {
      this.modalType = 'edit';
      this.userForm = {
        id: user.id,
        firstname: user.name.firstname || '',
        lastname: user.name.lastname || '',
        email: user.email || '',
        city: user.address.city || '',
      };
      this.showModal = true;
    },

    // Fecha o modal
    closeModal() {
      this.showModal = false;
    },

    // Salva os dados do usuário (adiciona ou edita)
    async saveUser() {
      try {
        if (this.modalType === 'add') {
          // Requisição para adicionar um novo usuário
          const response = await api.post('/users', {
            name: {
              firstname: this.userForm.firstname,
              lastname: this.userForm.lastname,
            },
            email: this.userForm.email,
            address: {
              city: this.userForm.city,
            },
          });

          // Normaliza os dados retornados
          const newUser = {
            id: response.data.id,
            name: {
              firstname: this.userForm.firstname,
              lastname: this.userForm.lastname,
            },
            email: this.userForm.email,
            address: {
              city: this.userForm.city,
            },
          };

          // Adiciona à lista de usuários
          this.users.push(newUser);
          this.filteredUsers.push(newUser);

          console.log('Usuário adicionado com sucesso:', newUser);
        } else if (this.modalType === 'edit') {
          // Requisição para atualizar os dados do usuário existente
          const response = await api.put(`/users/${this.userForm.id}`, {
            name: {
              firstname: this.userForm.firstname,
              lastname: this.userForm.lastname,
            },
            email: this.userForm.email,
            address: {
              city: this.userForm.city,
            },
          });

          // Normaliza os dados retornados
          const updatedUser = {
            id: this.userForm.id,
            name: {
              firstname: this.userForm.firstname,
              lastname: this.userForm.lastname,
            },
            email: this.userForm.email,
            address: {
              city: this.userForm.city,
            },
          };

          // Atualiza o usuário na lista
          const index = this.users.findIndex((user) => user.id === this.userForm.id);
          if (index !== -1) {
            this.users[index] = updatedUser;
            this.filteredUsers[index] = updatedUser;
          }

          console.log('Usuário editado com sucesso:', updatedUser);
        }

        this.closeModal(); // Fecha o modal após salvar
      } catch (error) {
        console.error('Erro ao salvar o usuário:', error);
      }
    },

    // Remove um usuário
    async removeUser(userId) {
      try {
        // Requisição para remover o usuário pelo ID
        await api.delete(`/users/${userId}`);
        this.users = this.users.filter((user) => user.id !== userId);
        this.filteredUsers = this.filteredUsers.filter((user) => user.id !== userId);
      } catch (error) {
        console.error('Erro ao remover o usuário:', error);
      }
    },
  },
};
</script>

<style scoped>
/* Estilo da tabela */
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

table th,
table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: left;
}

table th {
  background-color: #f4f4f4;
}

table tr:nth-child(even) {
  background-color: #f9f9f9;
}

table tr:hover {
  background-color: #f1f1f1;
}

/* Estilo da barra de busca */
input[type="text"] {
  margin-bottom: 1rem;
  padding: 0.5rem;
  width: 100%;
  max-width: 400px;
  box-sizing: border-box;
}

/* Botões de ação */
button {
  margin: 0 5px;
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}

button:hover {
  opacity: 0.9;
}

button:first-of-type {
  background-color: #4caf50;
  color: white; /* Botão verde (Adicionar/Salvar) */
}

button:last-of-type {
  background-color: #f44336;
  color: white; /* Botão vermelho (Cancelar/Remover) */
}

/* Estilo do modal */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5); /* Fundo semitransparente */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  position: relative;
}

.modal-content h2 {
  margin-bottom: 1rem;
}

.modal-content label {
  display: block;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.modal-content input {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-content button {
  margin-top: 1rem;
}
</style>