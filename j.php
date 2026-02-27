<?php

// --------------------
// Clase Departamento
// --------------------
class Departamento {
    public string $nombre;

    public function __construct(string $nombre) {
        $this->nombre = $nombre;
    }
}


// --------------------
// Clase Producto
// --------------------
class Producto {
    public string $nombre;        
    private float $precio;        
    private int $stock;           
    public Departamento $departamento;  

    public function __construct(string $nombre, float $precio, int $stock, Departamento $departamento) {
        $this->nombre = $nombre;
        $this->precio = $precio;
        $this->stock = $stock;
        $this->departamento = $departamento;
    }

    public function getPrecio(): float {
        return $this->precio;
    }

    public function getStock(): int {
        return $this->stock;
    }

    public function reducirStock(int $cant): void {
        $this->stock -= $cant;
    }
}


// --------------------
// Clase Carrito
// --------------------
class Carrito {
    /** @var array<string, array{producto:Producto, cantidad:int}> */
    public array $productos = []; 

    public function agregarProducto(Producto $producto, int $cantidad = 1): void {
        if ($producto->getStock() < $cantidad) {
            echo "Stock insuficiente\n";
            return;
        }

        $id = $producto->nombre;

        if (isset($this->productos[$id])) {
            $this->productos[$id]["cantidad"] += $cantidad;
        } else {
            $this->productos[$id] = [
                "producto" => $producto,
                "cantidad" => $cantidad
            ];
        }

        $producto->reducirStock($cantidad);
    }

    public function calcularTotal(float $impuesto = 0.21): float {
        $total = 0;

        foreach ($this->productos as $item) {
            $total += $item["producto"]->getPrecio() * $item["cantidad"];
        }

        return $total + ($total * $impuesto);
    }

    public function contarProductos(): int {
        return count($this->productos);
    }
}


// --------------------
// Clase Pago
// --------------------
class Pago {
    public string $metodo;
    public string $estado = "Pendiente";

    public function __construct(string $metodo) {
        $this->metodo = $metodo;
    }

    public function confirmar(): void {
        $this->estado = "Pagado";
    }
}


// --------------------
// Clase Pedido
// --------------------
class Pedido {
    public array $productos;
    public float $total;
    public Pago $pago;

    public function __construct(Carrito $carrito, Pago $pago) {
        $this->productos = $carrito->productos;
        $this->total = $carrito->calcularTotal();
        $this->pago = $pago;
    }
}


// --------------------
// Clase Cliente
// --------------------
class Cliente {
    public string $nombre;
    public Carrito $carrito;
    private array $pedidos = [];

    public function __construct(string $nombre) {
        $this->nombre = $nombre;
        $this->carrito = new Carrito();
    }

    public function confirmarPedido(Pago $pago): void {
        $pedido = new Pedido($this->carrito, $pago);
        $this->pedidos[] = $pedido;
        $this->carrito = new Carrito();
    }

    public function listarPedidos(): void {
        echo "Pedidos de " . $this->nombre . "\n";

        $i = 0;
        while ($i < count($this->pedidos)) {
            echo "Total: " . $this->pedidos[$i]->total .
                 " Estado: " . $this->pedidos[$i]->pago->estado . "\n";
            $i++;
        }

        echo "Cantidad: " . count($this->pedidos) . "\n\n";
    }
}


// --------------------
// Clase Tienda
// --------------------
class Tienda {
    public string $nombre;
    /** @var Producto[] */
    public array $productos = [];
    /** @var Cliente[] */
    public array $clientes = [];
    /** @var array<string, Producto[]> */
    public array $departamentos = []; 

    public function __construct(string $nombre) {
        $this->nombre = $nombre;
    }

    public function agregarProducto(Producto $producto): void {
        $this->productos[] = $producto;

        $depto = $producto->departamento->nombre;

        if (!isset($this->departamentos[$depto])) {
            $this->departamentos[$depto] = [];
        }

        $this->departamentos[$depto][] = $producto;
    }

    public function agregarCliente(Cliente $cliente): void {
        $this->clientes[] = $cliente;
    }

    public function listarProductosPorDepartamento(string $nombreDepto): void {
        echo "Productos del departamento " . $nombreDepto . "\n";

        if (isset($this->departamentos[$nombreDepto])) {
            foreach ($this->departamentos[$nombreDepto] as $p) {
                echo "- " . $p->nombre . "\n";
            }
        }

        echo "\n";
    }
}

?>




// --------------------
// PRUEBA
// --------------------

$tienda = new Tienda("Mi Tienda");

// Departamentos
$d1 = new Departamento("Electronica");
$d2 = new Departamento("Hogar");

// Productos
$p1 = new Producto("Notebook", 1200, 5, $d1);
$p2 = new Producto("Mouse", 20, 10, $d1);
$p3 = new Producto("Silla", 150, 3, $d2);

$tienda->agregarProducto($p1);
$tienda->agregarProducto($p2);
$tienda->agregarProducto($p3);

// Clientes
$c1 = new Cliente("Lucas");
$c2 = new Cliente("Ana");

$tienda->agregarCliente($c1);
$tienda->agregarCliente($c2);

// Carritos
$c1->carrito->agregarProducto($p1, 1);
$c1->carrito->agregarProducto($p2, 2);

$c2->carrito->agregarProducto($p3, 1);

// Pedidos
$pago1 = new Pago("Tarjeta");
$pago1->confirmar();
$c1->confirmarPedido($pago1);

$pago2 = new Pago("Efectivo");
$pago2->confirmar();
$c2->confirmarPedido($pago2);

// Listados
$c1->listarPedidos();
$c2->listarPedidos();

$tienda->listarProductosPorDepartamento("Electronica");
$tienda->listarProductosPorDepartamento("Hogar");

?>