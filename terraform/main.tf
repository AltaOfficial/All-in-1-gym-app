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
    name     = "${var.resource_group_name}"
    location = "East US"
}

resource "azurerm_postgresql_server" "db" {
    name                = "strive"
    location            = "East US"
    resource_group_name = "${azurerm_resource_group.rg.name}"
    version             = "17.6"
    sku_name            = "Standard_B1ms"

    administrator_login          = "${var.DB_USER}"
    administrator_login_password = "${var.DB_PASSWORD}"

    ssl_enforcement_enabled = true

    lifecycle {
        prevent_destroy = true
        ignore_changes = [
            administrator_login_password
        ]
    }
}

resource "azurerm_linux_web_app" "app" {
    name                = "striveapp"
    location            = "East US 2"
    resource_group_name = "${azurerm_resource_group.rg.name}"
    service_plan_id     = "${azurerm_app_service_plan.asp.id}"

    site_config {
        linux_fx_version = "DOCKER|${azurerm_container_registry.acr.login_server}/${azurerm_container_registry.acr.name}/striveapp:latest"
        always_on        = "true"

        application_stack {
            docker_image_name   = "${azurerm_container_registry.acr.login_server}/${azurerm_container_registry.acr.name}/striveapp:latest"
            docker_registry_url = "${azurerm_container_registry.acr.login_server}"
        }
    }

    app_settings = {
        "DB_PASSWORD"      = "${var.DB_PASSWORD}"
        "AZURE_STORAGE_CONNECTION_STRING" = "${var.AZURE_STORAGE_CONNECTION_STRING}"
        "DB_HOST"          = "${var.DB_HOST}"
        "DB_PASSWORD"      = "${var.DB_PASSWORD}"
        "DB_USER"          = "${var.DB_USER}"
        "JWT_SECRET_KEY"   = "${var.JWT_SECRET_KEY}"
        "SENTRY_AUTH_TOKEN" = "${var.SENTRY_AUTH_TOKEN}"
        "SENTRY_DSN"       = "${var.SENTRY_DSN}"
        "SERVER_PORT"      = "${var.SERVER_PORT}"
        "USDA_FOODDATA_API_KEY" = "${var.USDA_FOODDATA_API_KEY}"
    }

    identity {
        type = "SystemAssigned"
    }
}

resource "azurerm_container_registry" "acr" {
    name                = "striveapp"
    resource_group_name = "${azurerm_resource_group.rg.name}"
    location            = "East US"
    sku                 = "Standard"
    admin_enabled       = true
}

resource "azurerm_storage_account" "storage" {
    name                     = "striveapp"
    resource_group_name      = "${azurerm_resource_group.rg.name}"
    location                 = "eastus"
    account_tier             = "Standard"
    account_replication_type = "LRS"
}

resource "azurerm_service_plan" "asp" {
    name                = "striveapp"
    location            = "East US 2"
    resource_group_name = "${azurerm_resource_group.rg.name}"

    os_type             = "Linux"
    sku_name            = "B2"
}