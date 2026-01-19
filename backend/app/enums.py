from enum import Enum


class Priority(str, Enum):
    P0 = "P0"
    P1 = "P1"
    P2 = "P2"
    P3 = "P3"


class Domain(str, Enum):
    FRONTEND = "frontend"
    BACKEND = "backend"
    INFRA = "infra"
    DATA = "data"
    PRODUCT = "product"
    DESIGN = "design"
    QA = "qa"
    UNKNOWN = "unknown"


class Complexity(int, Enum):
    ONE = 1
    TWO = 2
    THREE = 3
    FIVE = 5
    EIGHT = 8
    THIRTEEN = 13
