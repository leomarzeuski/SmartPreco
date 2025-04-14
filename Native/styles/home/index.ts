import { StyleSheet } from "react-native";
import { appColors } from "@/constants/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: appColors.background,
  },
  scrollView: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: appColors.surface,
  },
  searchBar: {
    elevation: 2,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  searchInput: {
    fontSize: 14,
  },
  section: {
    marginTop: 16,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 8,
  },
  favoritesList: {
    paddingVertical: 8,
  },
  favoriteItem: {
    marginRight: 12,
  },
  favoriteImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 8,
    overflow: "hidden",
  },
  favoriteImage: {
    width: "100%",
    height: "100%",
  },
  placeholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
    borderRadius: 8,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  resultsTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 12,
  },
  resultsList: {
    paddingBottom: 16,
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 8,
    elevation: 2,
    overflow: "hidden",
  },
  resultContent: {
    flexDirection: "row",
    padding: 8,
    alignItems: "center",
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 4,
    overflow: "hidden",
  },
  resultImage: {
    width: "100%",
    height: "100%",
  },
  resultPlaceholderImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#e0e0e0",
  },
  resultInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  resultName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  resultPrice: {
    fontSize: 14,
    marginBottom: 8,
  },
  detailsButton: {
    backgroundColor: "#F4A261",
    padding: 6,
    borderRadius: 4,
    alignItems: "center",
    maxWidth: 120,
  },
  detailsButtonText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  favoriteButton: {
    marginLeft: "auto",
  },
});