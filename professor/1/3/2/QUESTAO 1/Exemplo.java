import java.util.Scanner;

public class Exemplo {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        while (scanner.hasNextLine()) {
            String line = scanner.nextLine();
            System.out.println(line.toUpperCase());
        }
        scanner.close();
    }
}
