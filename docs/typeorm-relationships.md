# 🔗 Relaciones TypeORM - Entidades del Sistema Contable

## 📊 Diagrama de Relaciones

```
┌─────────────────┐      ┌─────────────────────┐      ┌──────────────────────┐
│    Segment      │      │      Movement       │      │  AccountingAccount   │
├─────────────────┤      ├─────────────────────┤      ├──────────────────────┤
│ segmentId (PK)  │────┐ │ movementId (PK)     │ ┌────│ accountingAccountId  │
│ code            │    └─│ segmentId (FK)      │ │    │ (PK)                 │
│ name            │      │ accountingAccountId │─┘    │ accountCode          │
│                 │      │ (FK)                │      │ name                 │
│ movements[]     │      │ date                │      │                      │
│ (OneToMany)     │      │ type                │      │ movements[]          │
└─────────────────┘      │ number              │      │ (OneToMany)          │
                         │ supplier            │      └──────────────────────┘
                         │ concept             │
                         │ reference           │
                         │ charge              │
                         │                     │
                         │ segment (ManyToOne) │
                         │ accountingAccount   │
                         │ (ManyToOne)         │
                         └─────────────────────┘
```

## 🎯 Relaciones Implementadas

### **Movement ↔ Segment** (Many-to-One / One-to-Many)

**En Movement.entity.ts:**

```typescript
@ManyToOne(() => Segment, { eager: false })
@JoinColumn({ name: 'segment_id' })
segment: Segment;
```

**En Segment.entity.ts:**

```typescript
@OneToMany(() => Movement, (movement) => movement.segment)
movements: Movement[];
```

**Significado:**

- Cada movimiento pertenece a **un solo segmento**
- Cada segmento puede tener **múltiples movimientos**

### **Movement ↔ AccountingAccount** (Many-to-One / One-to-Many)

**En Movement.entity.ts:**

```typescript
@ManyToOne(() => AccountingAccount, { eager: false })
@JoinColumn({ name: 'accounting_account_id' })
accountingAccount: AccountingAccount;
```

**En AccountingAccount.entity.ts:**

```typescript
@OneToMany(() => Movement, (movement) => movement.accountingAccount)
movements: Movement[];
```

**Significado:**

- Cada movimiento pertenece a **una sola cuenta contable**
- Cada cuenta contable puede tener **múltiples movimientos**

## 🔧 Configuración Técnica

### **Foreign Keys Mantenidas**

```typescript
// En Movement.entity.ts
@Column({ name: 'segment_id' })
segmentId: number;

@Column({ name: 'accounting_account_id' })
accountingAccountId: number;
```

### **JoinColumn Configuration**

```typescript
@JoinColumn({ name: 'segment_id' })        // Especifica la columna FK
@JoinColumn({ name: 'accounting_account_id' })  // Especifica la columna FK
```

### **Eager Loading**

```typescript
{
  eager: false;
} // Las relaciones NO se cargan automáticamente
```

## 📚 Uso en Servicios

### **1. Obtener Movement con sus relaciones:**

```typescript
// En MovementService
async findOneWithRelations(id: number): Promise<Movement> {
  return this.movementRepository.findOne({
    where: { movementId: id },
    relations: ['segment', 'accountingAccount']
  });
}
```

### **2. Obtener Movement con QueryBuilder:**

```typescript
async findMovementsWithDetails(): Promise<Movement[]> {
  return this.movementRepository
    .createQueryBuilder('movement')
    .leftJoinAndSelect('movement.segment', 'segment')
    .leftJoinAndSelect('movement.accountingAccount', 'account')
    .getMany();
}
```

### **3. Obtener Segment con sus movimientos:**

```typescript
// En SegmentService
async findOneWithMovements(id: number): Promise<Segment> {
  return this.segmentRepository.findOne({
    where: { segmentId: id },
    relations: ['movements']
  });
}
```

### **4. Obtener AccountingAccount con movimientos:**

```typescript
// En AccountingAccountService
async findOneWithMovements(id: number): Promise<AccountingAccount> {
  return this.accountingAccountRepository.findOne({
    where: { accountingAccountId: id },
    relations: ['movements']
  });
}
```

## 🎯 Beneficios de las Relaciones

### **✅ Ventajas Implementadas:**

1. **Integridad Referencial:** TypeORM maneja automáticamente las FK
2. **Consultas Optimizadas:** Join automáticos cuando sea necesario
3. **Navegación de Objetos:** Acceso directo a objetos relacionados
4. **Lazy Loading:** Relaciones se cargan solo cuando se solicitan
5. **Type Safety:** TypeScript valida los tipos de las relaciones

### **📊 Ejemplos de Uso:**

```typescript
// Acceso a datos relacionados
const movement = await movementService.findOneWithRelations(1);
console.log(movement.segment.name); // Nombre del segmento
console.log(movement.accountingAccount.name); // Nombre de la cuenta

// Creación con relaciones
const newMovement = new Movement();
newMovement.segmentId = 1;
newMovement.accountingAccountId = 5;
// Las relaciones se resolverán automáticamente
```

## 🔍 Consultas SQL Generadas

### **Con relaciones (JOIN):**

```sql
SELECT
  m.movement_id,
  m.segment_id,
  m.accounting_account_id,
  m.date,
  m.type,
  s.segment_id,
  s.code,
  s.name as segment_name,
  a.accounting_account_id,
  a.account_code,
  a.name as account_name
FROM movements m
LEFT JOIN segments s ON m.segment_id = s.segment_id
LEFT JOIN accounting_accounts a ON m.accounting_account_id = a.accounting_account_id
WHERE m.movement_id = ?
```

### **Sin relaciones (Simple):**

```sql
SELECT * FROM movements WHERE movement_id = ?
```

## 📋 Validaciones Recomendadas

### **En DTOs:**

```typescript
// CreateMovementDto
export class CreateMovementDto {
  @IsNotEmpty()
  @IsNumber()
  segmentId: number;

  @IsNotEmpty()
  @IsNumber()
  accountingAccountId: number;

  // ... otros campos
}
```

### **En Servicios:**

```typescript
async create(createMovementDto: CreateMovementDto): Promise<Movement> {
  // Validar que el segmento existe
  const segment = await this.segmentService.findOne(createMovementDto.segmentId);
  if (!segment) {
    throw new NotFoundException('Segmento no encontrado');
  }

  // Validar que la cuenta contable existe
  const account = await this.accountingAccountService.findOne(createMovementDto.accountingAccountId);
  if (!account) {
    throw new NotFoundException('Cuenta contable no encontrada');
  }

  return this.movementRepository.save(createMovementDto);
}
```

## ✅ Estado de las Relaciones

- ✅ **Movement → Segment** (ManyToOne) implementada
- ✅ **Movement → AccountingAccount** (ManyToOne) implementada
- ✅ **Segment → Movement** (OneToMany) implementada
- ✅ **AccountingAccount → Movement** (OneToMany) implementada
- ✅ **Foreign Keys** preservadas para compatibilidad
- ✅ **JoinColumn** configurados correctamente
- ✅ **Compilación exitosa** sin errores

**Las relaciones TypeORM están completamente configuradas y listas para usar!** 🎉
