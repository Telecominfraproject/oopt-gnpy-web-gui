#Depending on the operating system of the host machines(s) that will build or run the containers, the image specified in the FROM statement may need to be changed.
#For more information, please see https://aka.ms/containercompat

FROM mcr.microsoft.com/dotnet/core/sdk:2.2 AS build
WORKDIR /app
EXPOSE 80

# copy csproj and restore as distinct layers
COPY *.sln .
COPY TelecomInfraProject/*.csproj ./TelecomInfraProject/
RUN dotnet restore

# copy everything else and build app
COPY TelecomInfraProject/. ./TelecomInfraProject/
WORKDIR /app/TelecomInfraProject
RUN dotnet publish -c Release -o out

FROM mcr.microsoft.com/dotnet/core/aspnet:2.2 AS runtime
WORKDIR /app
COPY --from=build /app/TelecomInfraProject/out ./
ENTRYPOINT ["dotnet", "TelecomInfraProject.dll"]