class Portfolio:

    def __init__(self, collection):
        self.collection = collection

    def load_portfolio(self, dataframe):
        for idx, row in dataframe.iterrows():
            self.collection.add(
                documents=[row["Techstack"]],
                metadatas=[{"links": row["Links"]}],
                ids=[str(idx)]
            )

    def query_links(self, skills, n_results=2):

        results = self.collection.query(
            query_texts=skills,
            n_results=n_results
        )

        links = []

        for metadata_list in results["metadatas"]:
            for item in metadata_list:
                links.append(item["links"])

        return list(set(links))
