variable "resource_group_name" {
    type = string
    description = "The name of the resource group to create"
    default = "Jaedon_resource_group"
}

variable "location" {
    type = string
    description = "The location of the resource group"
    default = "eastus"
}

variable "acr_sku" {
    type = string
    description = "The SKU of the Azure Container Registry"
    default = "Standard"
}

variable "acr_name" {
    type = string
    description = "The name of the Azure Container Registry"
    default = "striveapp"
}

variable "app_service_sku" {
    type = string
    description = "The SKU of the App Service Plan"
    default = "B2"
}
 
variable "AZURE_STORAGE_CONNECTION_STRING" {
    type = string
    description = "The connection string for the Azure Storage Account"
    sensitive = true
}

variable "DB_HOST" {
    type = string
    description = "The host of the database"
    default = "strive.postgres.database.azure.com"
}

variable "DB_PASSWORD" {
    type = string
    description = "The password of the database"
    sensitive = true
}

variable "DB_USER" {
    type = string
    description = "The username of the database"
    default = "postgres"
}

variable "JWT_SECRET_KEY" {
    type = string
    description = "The secret key for the JWT"
    sensitive = true
}

variable "SENTRY_AUTH_TOKEN" {
    type = string
    description = "The auth token for Sentry"
    sensitive = true
}

variable "SENTRY_DSN" {
    type = string
    description = "The DSN for Sentry"
    sensitive = true
}

variable "SERVER_PORT" {
    type = string
    description = "The port for the server"
    default = "8000"
}

variable "USDA_FOODDATA_API_KEY" {
    type = string
    description = "The API key for the USDA Food Data API"
    sensitive = true
}