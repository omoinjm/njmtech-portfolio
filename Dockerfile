#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE $PORT

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["NTech.Api/NTech.Api.csproj", "NTech.Api/"]
COPY ["NTech.Shared/NTech.Shared.csproj", "NTech.Shared/"]
RUN dotnet restore "./NTech.Api/NTech.Api.csproj"
COPY . .
WORKDIR "/src/NTech.Api"
RUN dotnet build "./NTech.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./NTech.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "NTech.Api.dll"]

# Set the entry point to start the application and bind to the dynamic port provided by Heroku
CMD ASPNETCORE_URLS=http://0.0.0.0:${PORT:-80} dotnet NTech.Api.dll
