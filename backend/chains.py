from portfolio import Portfolio
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import JsonOutputParser

class Chain:

    def __init__(self, llm):
        self.llm = llm

    def extract_jobs(self, page_data):

        prompt_extract = PromptTemplate.from_template(
            """
            ### SCRAPED TEXT FROM WEBSITE:
            {page_data}

            ### INSTRUCTION:
            The scraped text is from the career's page of a website.

            Your job is to extract the job postings and return them in JSON format containing the following keys:
            `role`, `experience`, `skills` and `description`.

            Only return valid JSON.
            """
        )

        chain_extract = prompt_extract | self.llm

        res = chain_extract.invoke(
            input={"page_data": page_data}
        )

        json_parser = JsonOutputParser()

        return json_parser.parse(res.content)

    def write_mail(self, job, links):

        prompt_email = PromptTemplate.from_template(
            """
            ### JOB DESCRIPTION:
            {job_description}

            ### INSTRUCTION:
            You are a Business Development Executive at TechNova Solutions.

            TechNova Solutions is an AI and Software Consulting company.

            Write a professional cold email for the above opportunity.

            Highlight relevant portfolio projects from:

            {link_list}

            Do not provide a preamble.
            """
        )

        chain_email = prompt_email | self.llm

        res = chain_email.invoke(
            {
                "job_description": str(job),
                "link_list": links
            }
        )

        return res.content
