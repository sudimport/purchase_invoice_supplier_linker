app_name = "purchase_invoice_supplier_linker"
app_title = "Purchase Invoice Supplier Linker"
app_publisher = "Thomas"
app_description = "Script per collegare articoli a codici fornitore automaticamente"
app_email = "thomas@example.com"
app_license = "MIT"

fixtures = [
    {
        "doctype": "Custom Script",
        "filters": [["name", "=", "Purchase Invoice Item-Client"]]
    }
]
