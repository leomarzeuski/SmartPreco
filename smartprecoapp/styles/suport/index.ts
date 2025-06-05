import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 20,
  },
  topicItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 10,
  },
  topicHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  topicTitle: {
    fontSize: 15,
    fontWeight: "500",
    flex: 1,
  },
  topicIcon: {
    margin: 0,
  },
  topicContent: {
    padding: 15,
    paddingTop: 0,
    color: "#555",
    lineHeight: 20,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
  },
  textArea: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 14,
    color: "#333",
    height: 120,
  },
  submitButton: {
    backgroundColor: "#2e8b57",
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  contactInfo: {
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  contactInfoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 15,
  },
  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  contactIcon: {
    margin: 0,
    backgroundColor: "#eee",
    borderRadius: 20,
  },
  contactText: {
    fontSize: 14,
    color: "#333",
    marginLeft: 5,
  },
});
