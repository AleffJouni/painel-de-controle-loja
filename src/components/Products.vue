<template>
  <div>
    <h1>Produtos</h1>
    <p>Gerencie os produtos da loja aqui.</p>

    <!-- Filtro por Categoria -->
    <label for="category">Filtrar por Categoria:</label>
    <select id="category" v-model="selectedCategory" @change="filterProducts">
      <option value="">Todas</option>
      <option v-for="category in categories" :key="category" :value="category">
        {{ category }}
      </option>
    </select>

    <!-- Ordenação -->
    <label for="sort">Ordenar por:</label>
    <select id="sort" v-model="sortOption" @change="sortProducts">
      <option value="price">Preço</option>
      <option value="rating">Classificação</option>
    </select>

    <!-- Botão Adicionar -->
    <button @click="addProduct">Adicionar Produto</button>

    <!-- Tabela de Produtos -->
    <div v-if="loading">Carregando produtos...</div>
    <div v-else>
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Categoria</th>
            <th>Preço</th>
            <th>Classificação</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filteredProducts" :key="product.id">
            <td>{{ product.title }}</td>
            <td>{{ product.category }}</td>
            <td>{{ product.price | currency }}</td>
            <td>{{ product.rating.rate }}</td>
            <td>
              <button @click="editProduct(product)">Editar</button>
              <button @click="removeProduct(product.id)">Remover</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal para Adicionar/Editar Produtos -->
    <div v-if="showModal" class="modal">
      <div class="modal-content">
        <h2>{{ modalType === 'add' ? 'Adicionar Produto' : 'Editar Produto' }}</h2>

        <form @submit.prevent="saveProduct">
          <label for="title">Título:</label>
          <input id="title" v-model="productForm.title" required />

          <label for="category">Categoria:</label>
          <select id="category" v-model="productForm.category" required>
            <option v-for="category in categories" :key="category" :value="category">
              {{ category }}
            </option>
          </select>

          <label for="price">Preço:</label>
          <input id="price" type="number" v-model.number="productForm.price" required />

          <div class="modal-buttons">
            <button type="submit">{{ modalType === 'add' ? 'Adicionar' : 'Salvar' }}</button>
            <button type="button" @click="closeModal">Cancelar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';

export default {
  name: 'Products',
  data() {
    return {
      products: [],
      filteredProducts: [],
      categories: [],
      selectedCategory: '',
      sortOption: 'price',
      loading: true,
      showModal: false,
      modalType: '',
      productForm: {
        id: null,
        title: '',
        category: '',
        price: '',
        rating: { rate: 0 },
      },
    };
  },
  async mounted() {
    try {
      const productsResponse = await api.get('/products');
      this.products = productsResponse.data;
      this.filteredProducts = productsResponse.data;

      const categoriesResponse = await api.get('/products/categories');
      this.categories = categoriesResponse.data;
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
    } finally {
      this.loading = false;
    }
  },
  methods: {
    filterProducts() {
      if (this.selectedCategory) {
        this.filteredProducts = this.products.filter(
          (product) => product.category === this.selectedCategory
        );
      } else {
        this.filteredProducts = this.products;
      }
      this.sortProducts();
    },
    sortProducts() {
      this.filteredProducts.sort((a, b) => {
        if (this.sortOption === 'price') {
          return a.price - b.price;
        } else if (this.sortOption === 'rating') {
          return b.rating.rate - a.rating.rate;
        }
      });
    },
    addProduct() {
      this.modalType = 'add';
      this.productForm = {
        id: null,
        title: '',
        category: '',
        price: '',
        rating: { rate: 0 },
      };
      this.showModal = true;
    },
    editProduct(product) {
      this.modalType = 'edit';
      this.productForm = {
        id: product.id,
        title: product.title,
        category: product.category,
        price: product.price,
        rating: product.rating,
      };
      this.showModal = true;
    },
    async removeProduct(productId) {
      try {
        await api.delete(`/products/${productId}`);
        this.products = this.products.filter((product) => product.id !== productId);
        this.filteredProducts = this.filteredProducts.filter(
          (product) => product.id !== productId
        );
      } catch (error) {
        console.error('Erro ao remover o produto:', error);
        alert('Erro ao remover o produto. Por favor, tente novamente.');
      }
    },
    async saveProduct() {
      try {
        if (this.modalType === 'add') {
          const response = await api.post('/products', {
            title: this.productForm.title,
            category: this.productForm.category,
            price: this.productForm.price,
          });

          const newProduct = {
            id: response.data.id,
            title: this.productForm.title,
            category: this.productForm.category,
            price: this.productForm.price,
            rating: { rate: 0 },
          };

          this.products.push(newProduct);
          this.filteredProducts.push(newProduct);
        } else if (this.modalType === 'edit') {
          const response = await api.put(`/products/${this.productForm.id}`, {
            title: this.productForm.title,
            category: this.productForm.category,
            price: this.productForm.price,
          });

          const updatedProduct = {
            id: this.productForm.id,
            title: this.productForm.title,
            category: this.productForm.category,
            price: this.productForm.price,
            rating: this.productForm.rating,
          };

          const index = this.products.findIndex(
            (product) => product.id === this.productForm.id
          );
          if (index !== -1) {
            this.products[index] = updatedProduct;
            this.filteredProducts[index] = updatedProduct;
          }
        }

        this.closeModal();
      } catch (error) {
        console.error('Erro ao salvar o produto:', error);
        alert('Erro ao salvar o produto. Verifique os dados e tente novamente.');
      }
    },
    closeModal() {
      this.showModal = false;
      this.productForm = {
        id: null,
        title: '',
        category: '',
        price: '',
        rating: { rate: 0 },
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

input,
select {
  margin: 1rem 0;
  padding: 0.5rem;
  font-size: 1rem;
}

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
  color: white;
}

button:last-of-type {
  background-color: #f44336;
  color: white;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
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
}

.modal-content input,
.modal-content select {
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.modal-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.modal-content button {
  margin-top: 1rem;
  margin-right: 1rem;
}
</style>