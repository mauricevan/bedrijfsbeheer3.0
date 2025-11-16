# Accounting Module - Complete Documentation

All 42 Features from Bedrijfsbeheer 2.0

Last Updated: 2025-11-16

## 1. Quote Management (P0)

Quote Lifecycle: Draft → Sent → Approved/Rejected/Expired

Features 1-11: Quote Status
1. Create quote (P0)
2. Edit quote (P0)
3. Delete quote (P0)
4. Send quote (P0)
5. Status: Draft (P0)
6. Status: Sent (P0)
7. Status: Approved (P0)
8. Status: Rejected (P0)
9. Status: Expired (P0)
10. Valid until date (P0)
11. Expiration tracking (P0)

Features 12-22: Quote Items & Labor
12. Add products from inventory (P0)
13. Manual item entry (P0)
14. Item description (P0)
15. Quantity per item (P0)
16. Price per unit (P0)
17. Item total auto-calc (P0)
18. Add labor/services (P0)
19. Labor description (P0)
20. Hours (P0)
21. Hourly rate (P0)
22. Labor total auto-calc (P0)

Features 23-26: Financial Calculations
23. Subtotal (items + labor, excl. VAT) (P0)
24. VAT rate (21% default) (P0)
25. VAT amount calculated (P0)
26. Total (incl. VAT) (P0)

Features 27-33: Quote Actions
27. Convert to invoice (P0)
28. Convert to work order (P0)
29. Duplicate quote (P1)
30. Print/Export PDF (P1)
31. Email quote to customer (P1)
32. Quote history tracking (P1)
33. Created by tracking (P1)

## 2. Invoice Management (P0)

Invoice Lifecycle: Draft → Sent → Paid/Overdue/Cancelled

Features 34-42: Invoice Status
34. Create invoice (P0)
35. Edit invoice (P0)
36. Delete invoice (P0)
37. Send invoice (P0)
38. Status: Draft (P0)
39. Status: Sent (P0)
40. Status: Paid (P0)
41. Status: Overdue (auto-detect) (P0)
42. Status: Cancelled (P0)

## 3. Invoice Numbering (P0 - CRITICAL)

Features 43-46:
43. Auto-numbering (INV-0001, INV-0002...) (P0)
44. Sequential without gaps (P0)
45. Year-based reset (2025-001, 2026-001) (P1)
46. Custom prefix option (P2)

## 4. Invoice Dates & Actions (P0)

Features 47-54:
47. Issue date (P0)
48. Due date (default +14 days) (P0)
49. Paid date (when status=paid) (P0)
50. Payment terms text (P1)
51. Mark as paid (P0)
52. Convert to work order (P0)
53. Print/Export PDF (P1)
54. Duplicate invoice (P1)

## 5. Reminder System (P0 - CRITICAL)

Features 55-62:
55. Reminder 1 (+7 days after due) (P0)
56. Reminder 2 (+14 days after due) (P0)
57. Auto-calculate reminder dates (P0)
58. Reminder 1 tracking (sent/not sent) (P0)
59. Reminder 2 tracking (sent/not sent) (P0)
60. Reminder sent dates (P0)
61. Auto-send capability (P1)
62. Email templates for reminders (P1)

## 6. Customer Integration (P0)

Features 63-66:
63. Customer selection (P0)
64. Customer details display (P0)
65. Filter by customer (P0)
66. Customer history view (P1)

## 7. Archive System (P1)

Features 67-72:
67. Archive list view (P1)
68. Archive search (P1)
69. Archive filter (status, customer, date) (P1)
70. PDF upload for external invoices (P1)
71. PDF generation (P1)
72. Archive export (P1)

## 8. Dashboard & Reporting (P0)

Features 73-80:
73. Total invoiced amount (P0)
74. Total paid amount (P0)
75. Total outstanding (P0)
76. Total overdue (P0)
77. Open quotes count (P0)
78. Average payment days (P1)
79. Revenue charts (P1)
80. Outstanding by customer chart (P1)

## 9. Audit Trail (P1)

Features 81-84:
81. Quote history log (P1)
82. Invoice history log (P1)
83. Action types tracking (P1)
84. Performer & timestamp tracking (P1)

---

## Key Data Structures

### Invoice Numbering Logic


### Reminder System Logic


### Financial Calculations


---

Total Features: 42
Critical (P0): 38
Important (P1): 13
Nice to have (P2): 1

Estimated Development: 8 weeks
