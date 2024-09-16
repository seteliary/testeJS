import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView } from "react-native";
import { fetchRecipes } from "../api";
import RecipeCard from "../components/RecipeCard";
import Ionicons from "react-native-vector-icons/Ionicons";

const HomeScreen = ({ navigation }) => {
  const [featuredRecipes, setFeaturedRecipes] = useState([]);
  const [loadingFeatured, setLoadingFeatured] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const loadFeaturedRecipes = async () => {
      try {
        const randomQuery = "random";
        const data = await fetchRecipes(randomQuery);
        const randomRecipes = data.hits
          .sort(() => 0.5 - Math.random())
          .slice(0, 5);
        setFeaturedRecipes(randomRecipes);
      } catch (error) {
        console.error("Erro:", error);
      } finally {
        setLoadingFeatured(false);
      }
    };
    loadFeaturedRecipes();
  }, []);

  const handleSearch = () => {
    navigation.navigate("SearchResults", { query });
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Pesquisar receitas"
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
        />
        <Ionicons
          name="search"
          size={20}
          color="gray"
          style={styles.searchIcon}
          onPress={handleSearch}
        />
      </View>
      <Text style={styles.title}>Receitas em destaque</Text>
      <ScrollView contentContainerStyle={styles.cardsContainer}>
        {loadingFeatured ? (
          <Text>Carregando...</Text>
        ) : (
          featuredRecipes.map((item) => (
            <RecipeCard
              key={item.recipe.uri}
              recipe={item.recipe}
              onPress={() =>
                navigation.navigate("RecipeDetail", { recipe: item.recipe })
              }
            />
          ))
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#ffb703", // Cor de fundo das páginas
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "gray",
    marginBottom: 10,
    backgroundColor: "#fff", // Fundo branco para a barra de pesquisa
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchInput: {
    flex: 1,
    padding: 10,
  },
  searchIcon: {
    padding: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  cardsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
});

export default HomeScreen;
