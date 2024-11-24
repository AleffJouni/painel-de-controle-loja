<template>
  <div>
    <h1>Dashboard</h1>
    <p>Bem-vindo ao painel de controle!</p>
    
    <div v-if="loading">Carregando dados...</div>
    
    <div v-else>
      <!-- Indicadores principais -->
      <div class="indicators">
        <div class="card">
          <h3>Total de Produtos</h3>
          <p>{{ totalProducts }}</p>
        </div>
        <div class="card">
          <h3>Número de Categorias</h3>
          <p>{{ totalCategories }}</p>
        </div>
        <div class="card">
          <h3>Total de Pedidos</h3>
          <p>{{ totalCarts }}</p>
        </div>
        <div class="card">
          <h3>Total de Usuários</h3>
          <p>{{ totalUsers }}</p>
        </div>
      </div>

      <!-- Gráfico: Distribuição de Produtos por Categoria -->
      <div class="chart">
        <h3>Distribuição de Produtos por Categoria</h3>
        <canvas id="categoryChart"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
import api from '../services/api';
import { Chart } from 'chart.js/auto';

export default {
  name: 'Dashboard',
  data() {
    return {
      totalProducts: 0,
      totalCategories: 0,
      totalCarts: 0,
      totalUsers: 0,
      categoryDistribution: [],
      loading: true, // Estado de carregamento
    };
  },
  async mounted() {
    try {
      // Fazendo requisições para obter os dados
      const products = await api.get('/products');
      const categories = await api.get('/products/categories');
      const carts = await api.get('/carts');
      const users = await api.get('/users');

      // Atualizando os dados no estado
      this.totalProducts = products.data.length;
      this.totalCategories = categories.data.length;
      this.totalCarts = carts.data.length;
      this.totalUsers = users.data.length;

      // Calculando distribuição por categoria
      this.calculateCategoryDistribution(products.data, categories.data);
    } catch (error) {
      console.error('Erro ao carregar os dados:', error);
    } finally {
      this.loading = false; // Atualiza o estado de carregamento
    }
  },
  watch: {
    loading(newValue) {
      if (!newValue) {
        // Quando o carregamento for concluído, renderiza o gráfico
        this.$nextTick(() => {
          this.renderCategoryChart();
        });
      }
    },
  },
  methods: {
    calculateCategoryDistribution(products, categories) {
      this.categoryDistribution = categories.map((category) => {
        return {
          category,
          count: products.filter((product) => product.category === category).length,
        };
      });
    },
    renderCategoryChart() {
      const canvas = document.getElementById('categoryChart');
      if (!canvas) {
        console.error('Canvas para o gráfico não encontrado.');
        return;
      }

      const ctx = canvas.getContext('2d');

      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: this.categoryDistribution.map((item) => item.category),
          datasets: [
            {
              data: this.categoryDistribution.map((item) => item.count),
              backgroundColor: [
                '#FF6384',
                '#36A2EB',
                '#FFCE56',
                '#4BC0C0',
                '#9966FF',
              ],
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
          },
        },
      });
    },
  },
};
</script>

<style scoped>
/* Indicadores principais */
.indicators {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 2rem;
}

.card {
  flex: 1 1 calc(25% - 1rem);
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.card h3 {
  margin-bottom: 1rem;
  font-size: 1.2rem;
  color: #333;
}

.card p {
  font-size: 1.5rem;
  font-weight: bold;
  color: #4caf50;
}

/* Gráfico */
.chart {
  margin-top: 2rem;
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  text-align: center;
}
</style>