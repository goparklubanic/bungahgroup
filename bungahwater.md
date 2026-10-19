Bungah Water Order and Delivery


# Database

![]():

sqlite


## databasename

bungahwater.sqlite


![]():

- customers:

  - phone\_number, string, primary key

  - name, string,

  - address, string,

  - given\_price, integer, default 0.


- orders\_deliveries

  - order\_id, integer

  - phone\_number, string, foreign key

  - order\_date, date,

  - order\_qty, integer,

  - delivery\_date, date default null,

  - delivery\_qty, integer, default 0,

  - delivery\_status, string \[pending, on\_delivery, delivered\] default pending.

  - payment\_status, string \[unpaid, paid\] default unpaid,


# Front End

![]():

ReactJS

## Application brand:

Bungah Group

## Application Name:

Water Delivery.


## Routes:

/

User have to input phone\_number and store it in the localStorage at first time open the page. After phone number stored, user can directly open the page.  
This page contains:

- Today delivery information from Bungah Water Corporation. The information consists of Number, Customer Name, Customer Address, Delivery Qty.

- Order button that redirect to whatsapp application to +62 856-4088-5740


/history

This page displaying its own last 20 orders and deliveries histories, consists of order\_date, order\_qty, delivery\_date, delivery\_qty, delivery\_status.


/bw

This is the dashboard of admin page. Protected by static password ‘bw2026’ prompt once at the first time. This page displays:

- All orders and deliveries with status on\_delivery as delivery list

- All orders and deliveries with status pending as order list.


/bw/customers

This page contains:

- Form to input and update customer data

- List of 20 customers that have pending delivery status. The header is: Number, Customer Name, Customer Address, Order\_Qty, Delivery\_Qty and Price. The price formula is customer.customer\_price \* orders\_deliveries.delivery\_qty


/bw/orders

This page displays:


- Form to input new order. Fields are Order\_date, Phone\_number, and Order\_Qty.

- All order and deliveries with status pending. The header is: Number, Customer Name and Phone Number, Order\_date, Order Qty, Delivery Qty, Actions. Actions is dropdown consists of: 

  - Deliver to update delivery\_qty, delivery\_date and delivery\_status.

  - Payment to update payment\_status.

  - ChQty to update order\_qty.

  - Cancel to delete the order. 


/bw/revenue

This page list all current payment value and status. The header is: Number, Customer Name, Delivery\_qty, Price (delivery\_qty \* customer\_price).


# Back End

## Softare:

express.js


## Endpoints

/deliveries

- method: get

- returns : all on\_delivery status of orders\_delivery.


/my-orders

- method: post

- payload: phone\_number

- returns: last 20 orders of customer with match phone number. Consists of order\_date, order\_qty, delivery\_date, delivery\_qty, delivery\_status.


/orders

- method: get

- payload: none

- returns: orders\_deliveries\[ order\_date, order\_qty, delivery\_date, delivery\_qty, delivery\_status \], customers\[name, address\], with delivery\_status !=delivered, order by delivery\_status, customer\_name


/order\_new

- method: post

- payload: phone\_number, order\_date, order\_qty

- returns: insertion status.


/order\_update

- method: post,

- payload: order\_id, order\_qty

- returns: update status


/order\_cancel

- method: post

- payload: order\_id

- returns: deletion status


/customers:

- method: get

- payload: none

- returns: 20 customers who has pending order status. Fields:  Customer Name, Customer Address, Order\_Qty, Delivery\_Qty and Price


/customer\_new

- method: post

- payload: phone\_number, name, address, given\_price

- returns: insertion status


/customer\_update

- method: post

- payload: phone\_number, name, address, given\_price

- returns: update\_status


/reveneue

- method: post

- payloads: current\_date

- returns: Customer Name, Delivery\_qty, Price (delivery\_qty \* customer\_price) that delivery\_date match with current\_date, and delivery\_status=delivered.


