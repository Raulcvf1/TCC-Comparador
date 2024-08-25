using System;

namespace ConsoleApp1
{
    internal class Program
    {
        static void Main(string[] args)
        {

            // Lê a primeira linha da entrada e converte para inteiro
            int num1 = int.Parse(Console.ReadLine());

            // Lê a segunda linha da entrada e converte para inteiro
            int num2 = int.Parse(Console.ReadLine());

            // Soma os dois números
            int soma = num1 + num2;

            // Imprime o resultado da soma
            Console.WriteLine(soma);

        }
    }
}
