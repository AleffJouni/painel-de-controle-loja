<template>
  <div>
    <h1>Carrinhos</h1>
    <p>Gerencie os carrinhos de compras aqui.</p>

    <!-- Filtro por Usuário -->
    <label for="user">Filtrar por Usuário:</label>
    <select id="user" v-model="selectedUser" @change="filterCarts">
      <option value="">Todos</option>
      <option v-for="user in users" :key="user.id" :value="user.id">
        {{ user.name.firstname }} {{ user.name.lastname }}
      </option>
    </select>

    <!-- Filtro por Data -->
    <label for="date">Filtrar por Data:</label>
    <input id="date" type="date" v-model="selectedDate" @change="filterCarts" />

    <div v-if="loading">Carregando carrinhos...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Usuário</th>
            <th>Data</th>
            <th>Total (R$)</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="cart in filteredCarts" :key="cart.id">
            <td>{{ cart.id }}</td>
            <td>
              {{ getUserFullName(cart.userId) }}
            </td>
            <td>{{ cart.date }}</td>
            <td>{{ calculateTotal(cart.products) | currency }}</td>
            <td>
              <button @click="editCart(cart)">Editar</button>
              <button @click="removeCart(cart.id)">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para Editar Carrinho -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>Editar Carrinho</h2>

        <table>
          <thead>
            <tr>
              <th>Produto</th>
              <th>Quantidade</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartForm.products" :key="item.productId">
              <td>{{ getProductTitle(item.productId) }}</td>
              <td>
                <input type="number" v-model.number="item.quantity" min="1" />
              </td>
              <td>
                <button @click="removeProductFromCart(item.productId)">Remover</button>
              </td>
            </tr>
          </tbody>
        </table>

        <button @click="addProductToCart">Adicionar Produto</button>
        <button @click="saveCart">Salvar</button>
        <button @click="closeModal">Cancelar</button>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Carts',
  data() {
    return {
      carts: [],
      filteredCarts: [],
      users: [],
      products: [],
      selectedUser: '',
      selectedDate: '',
      loading: true,
      showModal: false,
      cartForm: {
        id: null,
        userId: null,
        date: '',
        products: [],
      },
    };
  },
  async mounted() {
    try {
      // Carrega os dados dos carrinhos, usuários e produtos
      const cartsResponse = await api.get('/carts');
      this.carts = cartsResponse.data;
      this.filteredCarts = cartsResponse.data;

      const usersResponse = await api.get('/users');
      this.users = usersResponse.data;

      const productsResponse = await api.get('/products');
      this.products = productsResponse.data;
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    filterCarts() {
      this.filteredCarts = this.carts.filter((cart) => {
        const matchesUser =
          this.selectedUser === '' || cart.userId === parseInt(this.selectedUser);
        const matchesDate =
          this.selectedDate === '' || cart.date.startsWith(this.selectedDate);
        return matchesUser && matchesDate;
      });
    },
    getUserFullName(userId) {
      const user = this.users.find((u) => u.id === userId);
      return user ? `${user.name.firstname} ${user.name.lastname}` : 'Desconhecido';
    },
    getProductTitle(productId) {
      const product = this.products.find((p) => p.id === productId);
      return product ? product.title : 'Produto Desconhecido';
    },
    calculateTotal(products) {
      return products.reduce((total, item) => {
        const product = this.products.find((p) => p.id === item.productId);
        return total + (product ? product.price * item.quantity : 0);
      }, 0);
    },
    editCart(cart) {
      this.cartForm = { ...cart };
      this.showModal = true;
    },
    async removeCart(cartId) {
      try {
        await api.delete(`/carts/${cartId}`);
        this.carts = this.carts.filter((cart) => cart.id !== cartId);
        this.filteredCarts = this.filteredCarts.filter((cart) => cart.id !== cartId);
      } catch (error) {
        console.error('Erro ao remover carrinho:', error);
      }
    },
    removeProductFromCart(productId) {
      this.cartForm.products = this.cartForm.products.filter(
        (item) => item.productId !== productId
      );
    },
    addProductToCart() {
      this.cartForm.products.push({ productId: null, quantity: 1 });
    },
    async saveCart() {
      try {
        await api.put(`/carts/${this.cartForm.id}`, this.cartForm);
        const index = this.carts.findIndex((cart) => cart.id === this.cartForm.id);
        if (index !== -1) {
          this.carts[index] = { ...this.cartForm };
          this.filteredCarts[index] = { ...this.cartForm };
        }
        this.closeModal();
      } catch (error) {
        console.error('Erro ao salvar carrinho:', error);
      }
    },
    closeModal() {
      this.showModal = false;
      this.cartForm = {
        id: null,
        userId: null,
        date: '',
        products: [],
      };
    },
  },
  filters: {
    currency(value) {
      return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value);
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
  color: white; /* Botão verde para ações principais */
}

button:last-of-type {
  background-color: #f44336;
  color: white; /* Botão vermelho para exclusões */
}

/* Campos de entrada */
input,
select {
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
  width: 100%;
  max-width: 300px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Modal */
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
  max-width: 600px;
  width: 100%;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
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

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.modal-content button {
  margin-top: 1rem;
  margin-right: 1rem;
}

</style>