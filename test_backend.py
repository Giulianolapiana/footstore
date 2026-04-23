import requests
import json

BASE = 'http://localhost:8000'

print('=== PRUEBAS BACKEND ===')
print()

# 1. Root
r = requests.get(f'{BASE}/')
print(f'GET / => {r.status_code}: {r.json()}')
assert r.status_code == 200

# 2. Categorias CRUD
print()
print('--- CATEGORIAS ---')
r = requests.post(f'{BASE}/categorias/', json={'nombre': 'Pizzas', 'descripcion': 'Pizzas artesanales', 'parent_id': None, 'imagen_url': 'https://img.com/pizza.jpg'})
print(f'POST /categorias/ => {r.status_code}: {r.json()}')
assert r.status_code == 201
cat_id = r.json()['id']

r = requests.post(f'{BASE}/categorias/', json={'nombre': 'Pizzas Especiales', 'descripcion': 'Sub-cat de Pizzas', 'parent_id': cat_id})
sub_cat = r.json()
print(f'POST sub-cat => {r.status_code}: parent_id={sub_cat["parent_id"]}')
assert r.status_code == 201

r = requests.get(f'{BASE}/categorias/')
print(f'GET /categorias/ => {r.status_code}: {len(r.json())} categorias')
assert r.status_code == 200

r = requests.get(f'{BASE}/categorias/{cat_id}')
cat_data = r.json()
print(f'GET /categorias/{cat_id} => {r.status_code}: {cat_data["nombre"]}')
assert r.status_code == 200

r = requests.put(f'{BASE}/categorias/{cat_id}', json={'nombre': 'Pizzas Gourmet', 'descripcion': 'Pizzas premium', 'parent_id': None, 'imagen_url': None})
upd = r.json()
print(f'PUT /categorias/{cat_id} => {r.status_code}: nombre={upd["nombre"]}')
assert r.status_code == 200

# 3. Ingredientes CRUD
print()
print('--- INGREDIENTES ---')
r = requests.post(f'{BASE}/ingredientes/', json={'nombre': 'Mozzarella', 'descripcion': 'Queso mozzarella', 'es_alergeno': True})
print(f'POST /ingredientes/ => {r.status_code}: {r.json()}')
assert r.status_code == 201
ing_id = r.json()['id']

r = requests.post(f'{BASE}/ingredientes/', json={'nombre': 'Tomate', 'descripcion': 'Salsa de tomate', 'es_alergeno': False})
print(f'POST /ingredientes/ => {r.status_code}: nombre=Tomate')
assert r.status_code == 201

r = requests.get(f'{BASE}/ingredientes/')
print(f'GET /ingredientes/ => {r.status_code}: {len(r.json())} ingredientes')
assert r.status_code == 200

r = requests.get(f'{BASE}/ingredientes/{ing_id}')
ing_data = r.json()
print(f'GET /ingredientes/{ing_id} => {r.status_code}: es_alergeno={ing_data["es_alergeno"]}')
assert r.status_code == 200

r = requests.put(f'{BASE}/ingredientes/{ing_id}', json={'nombre': 'Mozzarella Fresca', 'descripcion': 'Queso mozzarella italiano', 'es_alergeno': True})
upd_ing = r.json()
print(f'PUT /ingredientes/{ing_id} => {r.status_code}: nombre={upd_ing["nombre"]}')
assert r.status_code == 200

# 4. Productos CRUD
print()
print('--- PRODUCTOS ---')
r = requests.post(f'{BASE}/productos/', json={'nombre': 'Pizza Margherita', 'descripcion': 'Clasica italiana', 'precio_base': 1500.00, 'imagenes_url': ['https://img.com/marg.jpg'], 'stock_cantidad': 50, 'disponible': True})
prod_data = r.json()
print(f'POST /productos/ => {r.status_code}: {prod_data["nombre"]}')
assert r.status_code == 201
prod_id = prod_data['id']

r = requests.get(f'{BASE}/productos/')
print(f'GET /productos/ => {r.status_code}: {len(r.json())} productos')
assert r.status_code == 200

r = requests.put(f'{BASE}/productos/{prod_id}', json={'nombre': 'Pizza Margherita XL', 'descripcion': 'Clasica italiana grande', 'precio_base': 2000.00, 'imagenes_url': ['https://img.com/marg-xl.jpg'], 'stock_cantidad': 30, 'disponible': True})
upd_prod = r.json()
print(f'PUT /productos/{prod_id} => {r.status_code}: nombre={upd_prod["nombre"]}, stock={upd_prod["stock_cantidad"]}')
assert r.status_code == 200

# 5. ProductoCategoria
print()
print('--- PRODUCTO-CATEGORIA ---')
r = requests.post(f'{BASE}/producto-categoria/', json={'producto_id': prod_id, 'categoria_id': cat_id, 'es_principal': True})
pc = r.json()
print(f'POST /producto-categoria/ => {r.status_code}: es_principal={pc["es_principal"]}')
assert r.status_code == 201

r = requests.get(f'{BASE}/producto-categoria/')
print(f'GET /producto-categoria/ => {r.status_code}: {len(r.json())} relaciones')
assert r.status_code == 200

# 6. ProductoIngrediente
print()
print('--- PRODUCTO-INGREDIENTE ---')
r = requests.post(f'{BASE}/producto-ingrediente/', json={'producto_id': prod_id, 'ingrediente_id': ing_id, 'es_removible': True})
pi_data = r.json()
print(f'POST /producto-ingrediente/ => {r.status_code}: es_removible={pi_data["es_removible"]}')
assert r.status_code == 201

r = requests.get(f'{BASE}/producto-ingrediente/')
print(f'GET /producto-ingrediente/ => {r.status_code}: {len(r.json())} relaciones')
assert r.status_code == 200

# 7. Delete tests
print()
print('--- DELETES ---')
r = requests.delete(f'{BASE}/producto-ingrediente/{prod_id}/{ing_id}')
print(f'DELETE /producto-ingrediente => {r.status_code}')
assert r.status_code == 204

r = requests.delete(f'{BASE}/producto-categoria/{prod_id}/{cat_id}')
print(f'DELETE /producto-categoria => {r.status_code}')
assert r.status_code == 204

# 8. 404 tests
print()
print('--- 404 TESTS ---')
r = requests.get(f'{BASE}/ingredientes/999')
print(f'GET /ingredientes/999 => {r.status_code} (expected 404)')
assert r.status_code == 404

r = requests.get(f'{BASE}/productos/999')
print(f'GET /productos/999 => {r.status_code} (expected 404)')
assert r.status_code == 404

r = requests.get(f'{BASE}/categorias/999')
print(f'GET /categorias/999 => {r.status_code} (expected 404)')
assert r.status_code == 404

print()
print('=============================')
print('TODAS LAS PRUEBAS PASARON OK')
print('=============================')
