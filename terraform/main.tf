terraform {
    required_providers {
        azurerm = {
            source = "hashicorp/azurerm"
            version = "~> 3.0.2"
        }
    }

    required_version = ">= 1.1.0"
}

provider "azurerm" {
    features {}
}

resource "azurerm_resource_group" "rg" {
    name     = var.resource_group_name
    location = "East US"
}

resource "azurerm_postgresql_flexible_server" "db" {
    name                = "strive"
    location            = "East US"
    resource_group_name = azurerm_resource_group.rg.name
    sku_name            = "B_Standard_B1ms"
    zone                = "1"

    administrator_login           = var.DB_USER
    administrator_password        = var.DB_PASSWORD
    storage_mb                    = 32768

    lifecycle {
        prevent_destroy = true
        ignore_changes = [
            administrator_password
        ]
    }
}

resource "azurerm_service_plan" "asp" {
    name                = "striveapp"
    location            = "East US 2"
    resource_group_name = azurerm_resource_group.rg.name

    os_type             = "Linux"
    sku_name            = "B2"
}

resource "azurerm_linux_web_app" "app" {
    name                = "striveapp"
    location            = "East US 2"
    resource_group_name = azurerm_resource_group.rg.name
    service_plan_id     = azurerm_service_plan.asp.id

    site_config {
        always_on       = true 
        ftps_state      = "FtpsOnly"

        application_stack {
            docker_image     = "${azurerm_container_registry.acr.login_server}/striveapp"
            docker_image_tag = "latest"
        }
    }

    app_settings = {
        # Docker
        DOCKER_REGISTRY_SERVER_URL      = "https://${azurerm_container_registry.acr.login_server}"
        DOCKER_REGISTRY_SERVER_USERNAME = azurerm_container_registry.acr.admin_username
        DOCKER_REGISTRY_SERVER_PASSWORD = azurerm_container_registry.acr.admin_password
        DOCKER_ENABLE_CI                = true

        # Storage
        AZURE_STORAGE_CONNECTION_STRING = var.AZURE_STORAGE_CONNECTION_STRING

        # Database
        DB_HOST                         = var.DB_HOST
        DB_PASSWORD                     = var.DB_PASSWORD
        DB_USER                         = var.DB_USER
        
        # Application
        JWT_SECRET_KEY                  = var.JWT_SECRET_KEY
        USDA_FOODDATA_API_KEY           = var.USDA_FOODDATA_API_KEY

        # Sentry
        SENTRY_AUTH_TOKEN               = var.SENTRY_AUTH_TOKEN
        SENTRY_DSN                      = var.SENTRY_DSN
        SERVER_PORT                     = var.SERVER_PORT
    }
}

resource "azurerm_container_registry" "acr" {
    name                = "striveapp"
    resource_group_name = azurerm_resource_group.rg.name
    location            = "East US"
    sku                 = "Standard"
    admin_enabled       = true
}

resource "azurerm_storage_account" "storage" {
    name                     = "striveapp"
    resource_group_name      = azurerm_resource_group.rg.name
    location                 = "eastus"
    account_tier             = "Standard"
    account_replication_type = "LRS"
}