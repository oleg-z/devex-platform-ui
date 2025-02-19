<template>
  <div>
    <h2>Dashboard</h2>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { onMounted } from 'vue';

export default {
  setup() {
    const router = useRouter();

    const logout = () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("userId");
      console.log("User logged out. Token removed.");
      router.push('/auth/login'); // Redirect to login page
    };

    onMounted(() => {
      logout(); // Execute logout on page load
    });

    return { logout };
  }
};
</script>
