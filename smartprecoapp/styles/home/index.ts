import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchContainer: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  searchBar: {
    elevation: 0,
    borderWidth: 1,
    borderColor: "#eee",
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
  },
  searchInput: {
    fontSize: 14,
  },
  section: {
    padding: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  divider: {
    height: 4,
    backgroundColor: "#f5f5f5",
  },
  productList: {
    paddingBottom: 20,
  }
});