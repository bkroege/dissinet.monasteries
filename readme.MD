# urls

- https://fr.wikipedia.org/wiki/Liste_d%27abbayes_b%C3%A9n%C3%A9dictines_de_France
- https://fr.wikipedia.org/wiki/Liste_d%27abbayes_pr%C3%A9montr%C3%A9es_de_France
- https://fr.wikipedia.org/wiki/Liste_des_abbayes,_prieur%C3%A9s_et_monast%C3%A8res_en_France
- https://fr.wikipedia.org/wiki/Liste_d%27abbayes_cisterciennes_de_France

# monastery schema

`
monastery =
{
id: <uid>,
sources: [<url>],
name: <text>,
orders: [<Order>],
types: [<Type>]
}

Type = {
name: <text>,
time: <Time>
}

Order = {
id: <orderId>,
gender: <gender>,
note: <text>,
time: <Time>
}

Time = {
from: {
post: <year>,
ante: <year>,
note: <text>
},
to: {
post: <year>,
ante: <year>,
note: <text>
}
}
`
