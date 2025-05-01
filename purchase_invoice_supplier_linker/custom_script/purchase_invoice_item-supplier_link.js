frappe.ui.form.on("Purchase Invoice Item", {
    custom_supplier_part_number: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if (!row.custom_supplier_part_number) return;

        if (!frm.doc.supplier) {
            frappe.msgprint("Seleziona prima il fornitore nella fattura.");
            return;
        }

        frappe.call({
            method: "frappe.client.get_list",
            args: {
                doctype: "Item Supplier",
                filters: {
                    supplier_part_number: row.custom_supplier_part_number,
                    supplier: frm.doc.supplier
                },
                fields: ["parent"]
            },
            callback: function(r) {
                if (r.message && r.message.length > 0) {
                    row.item_code = r.message[0].parent;
                    frm.refresh_field("items");
                    frappe.show_alert("✅ Articolo associato automaticamente!");
                } else {
                    frappe.confirm(
                        "❓ Codice fornitore non trovato. Vuoi associarlo al prodotto selezionato?",
                        () => {
                            if (!row.item_code) {
                                frappe.msgprint("Seleziona prima il prodotto (item_code) per poter creare l'associazione.");
                                return;
                            }

                            frappe.call({
                                method: "frappe.client.insert",
                                args: {
                                    doc: {
                                        doctype: "Item Supplier",
                                        parenttype: "Item",
                                        parent: row.item_code,
                                        parentfield: "supplier_items",
                                        supplier: frm.doc.supplier,
                                        supplier_part_number: row.custom_supplier_part_number,
                                        docstatus: 0
                                    }
                                },
                                callback: function(res) {
                                    if (res.message) {
                                        frappe.show_alert("🔗 Associazione creata con successo!");
                                    }
                                }
                            });

                        },
                        () => {
                            frappe.show_alert("❌ Associazione annullata.");
                        }
                    );
                }
            }
        });
    }
});
