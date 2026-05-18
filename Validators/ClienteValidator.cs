using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using System.Net.Mail;


public static class ClienteValidator
{

    private static bool CpfValido(string cpf)
    {
        // Verifica se todos os números são iguais
        // Ex: 11111111111
        if (cpf.Distinct().Count() == 1)
        {
            return false;
        }

        // =========================
        // Validação do primeiro dígito
        // =========================

        int soma = 0;

        for (int i = 0; i < 9; i++)
        {
            soma += (cpf[i] - '0') * (10 - i);
        }

        int resto = soma % 11;
        int primeiroDigito = resto < 2 ? 0 : 11 - resto;

        // =========================
        // Validação do segundo dígito
        // =========================

        soma = 0;

        for (int i = 0; i < 10; i++)
        {
            soma += (cpf[i] - '0') * (11 - i);
        }

        resto = soma % 11;
        int segundoDigito = resto < 2 ? 0 : 11 - resto;

        // Verifica se os dígitos calculados batem com os do CPF
        return cpf[9] - '0' == primeiroDigito &&
            cpf[10] - '0' == segundoDigito;
    }

    private static bool EmailValido(string email)
    {
        try
        {
            var enderecoEmail = new MailAddress(email);
            return enderecoEmail.Address == email;
        }
        catch
        {
            return false;
        }
}

    public static async Task<string> ValidaCliente(
        Cliente cliente,
        AppDbContext context,
        int? idClienteAtual = null
    )
    {
        // ------------ NOME ------------
        if (string.IsNullOrWhiteSpace(cliente.Nome))
        {
            return "O Nome não pode estar vazio.";
        }

        if (cliente.Nome.Length > 255)
        {
            return "O nome do cliente pode ter no máximo 255 caracteres.";
        }


        // ------------ CPF -------------

        if (string.IsNullOrWhiteSpace(cliente.Cpf))
        {
            return "O CPF não pode estar vazio.";
        }

        if (!Regex.IsMatch(cliente.Cpf, @"^\d{11}$"))
        {
            return "O CPF deve ter 11 dígitos e apenas números, no formato 11122233345.";
        }

        if (!CpfValido(cliente.Cpf))
        {
            return "O CPF é inválido.";
        }

        var clienteMesmoCPF = await context.Clientes
            .FirstOrDefaultAsync(x => x.Cpf == cliente.Cpf && x.Id != idClienteAtual);

        if (clienteMesmoCPF != null)
        {
            return "Já existe um cliente cadastrado com este CPF.";
        }


        // ------------ EMAIL ------------
        if (string.IsNullOrWhiteSpace(cliente.Email))
        {
            return "O Email não pode estar vazio.";
        }

        if (cliente.Email.Length > 255)
        {
            return "O email pode ter no máximo 255 caracteres.";
        }

        if (!EmailValido(cliente.Email))
        {
            return "E-mail inválido.";
        }

        var clienteMesmoEmail = await context.Clientes
            .FirstOrDefaultAsync(x =>
                x.Email == cliente.Email &&
                x.Id != idClienteAtual
            );

        if (clienteMesmoEmail != null)
        {
            return "Já existe um cliente cadastrado com este e-mail.";
}

        // ------- DATA NASCIMENTO -------
        if (cliente.DtNascimento == default)
        {
            return "A data de nascimento é obrigatória.";
        }

        if (cliente.DtNascimento > DateOnly.FromDateTime(DateTime.Today))
        {
            return "A data de nascimento não deve ser após hoje.";
        }

        if (cliente.DtNascimento == DateOnly.FromDateTime(DateTime.Today))
        {
            return "A data de nascimento não deve ser hoje.";
        }


        // ---------- ENDEREÇO -----------
        if (string.IsNullOrWhiteSpace(cliente.Endereco))
        {
            return "O endereço não pode estar vazio.";
        }

        if (cliente.Endereco.Length > 255)
        {
            return "O endereço deve ter no máximo 255 caracteres.";
        }

        return "";
    }
}