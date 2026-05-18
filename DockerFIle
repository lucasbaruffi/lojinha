# Imagem para build
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS build

WORKDIR /app

# Copia os arquivos
COPY . ./

# Restaura dependências
RUN dotnet restore

# Publica a aplicação
RUN dotnet publish -c Release -o out

# Imagem final para execução
FROM mcr.microsoft.com/dotnet/aspnet:10.0-preview

WORKDIR /app

COPY --from=build /app/out .

# Porta usada pelo Render
EXPOSE 10000

# Diz ao ASP.NET para escutar na porta 10000
ENV ASPNETCORE_URLS=http://+:10000

# Nome da DLL do seu projeto
ENTRYPOINT ["dotnet", "lojinha.dll"]