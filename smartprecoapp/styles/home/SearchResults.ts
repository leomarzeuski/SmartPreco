import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
  },
  resultsList: {
    paddingBottom: 20,
  },
  resultCard: {
    marginBottom: 12,
    borderRadius: 10,

    elevation: 3,
    backgroundColor: "#fff",
    position: "relative",
  },
  typeBadge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: "#3498db",
    width: 24,
    height: 24,
    borderBottomLeftRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },
  typeBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  resultContent: {
    flexDirection: "row",
    padding: 12,
  },
  resultImageContainer: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    marginRight: 15,
    backgroundColor: "#f5f5f5",
  },
  resultImage: {
    width: "80%",
    height: "80%",
    resizeMode: "contain",
  },
  iconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#e0e0e0",
    justifyContent: "center",
    alignItems: "center",
  },
  resultInfo: {
    flex: 1,
    justifyContent: "center",
  },
  resultName: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 5,
  },
  resultPrice: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#2e8b57",
  },
  resultCategory: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  resultDescription: {
    fontSize: 12,
    color: "#777",
    marginBottom: 4,
    lineHeight: 16,
  },
  resultLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  emptyResults: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 50,
  },
  emptyResultsText: {
    fontSize: 16,
    color: "#666",
  },
  favoriteButton: {
    alignSelf: "center",
    margin: 0,
  },
});
