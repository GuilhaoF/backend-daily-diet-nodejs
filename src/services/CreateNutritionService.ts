import type { DataProps } from "../controllers/CreateNutritionController";
import { GoogleGenerativeAI } from "@google/generative-ai";

class CreateNutritionService {
  async execute({
    name,
    age,
    gender,
    height,
    level,
    objective,
    weight,
  }: DataProps) {
    try {
      // biome-ignore lint/style/noNonNullAssertion: <explanation>
      const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      const response = await model.generateContent(
        `Crie uma dieta completa de segunda a domingo para uma pessoa com nome: ${name} do sexo ${gender} com peso atual: ${weight}kg, altura: ${height}, idade: ${age} anos e com foco e objetivo em ${objective}, atualmente nível de atividade: ${level} e ignore qualquer outro parametro que não seja os passados, retorne em json com as respectivas propriedades, propriedade nome o nome da pessoa, propriedade sexo com sexo, propriedade idade, propriedade altura, propriedade peso, propriedade objetivo com o objetivo atual, propriedade refeições com uma array contendo a semana de segunda a sexta e  dentro cada objeto sendo uma refeição da dieta e dentro de cada refeição a propriedade horário com horário da refeição, propriedade nome com nome e a propriedade alimentos com array contendo os alimentos dessa refeição e pode incluir uma propreidade como suplementos contendo array com sugestão de suplemento que é indicado para o sexo dessa pessoa e o objetivo dela e não retorne nenhuma observação alem das passadas no prompt, retorne em json e nenhuma propriedade pode ter acento.`
      );

      if (response.response?.candidates) {
        const jsonText = response.response.candidates[0]?.content.parts[0]
          .text as string;

        //Extrair o JSON
        const jsonString = jsonText
          .replace(/```\w*\n/g, "")
          .replace(/\n```/g, "")
          .trim();

        const jsonObject = JSON.parse(jsonString);

        return { data: jsonObject };
      }
    } catch (err) {
      console.log(err.message);
      throw new Error("Failed to generate nutrition");
    }
  }
}

export { CreateNutritionService };
