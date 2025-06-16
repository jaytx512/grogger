try:
    import pygame
except ModuleNotFoundError as exc:
    print("pygame module is required to run grogger."
          "\nInstall it using `pip install -r requirements.txt`." )
    raise exc
import random

# Game constants
WIDTH, HEIGHT = 640, 480
FPS = 60
LANE_HEIGHT = 40
NUM_LANES = HEIGHT // LANE_HEIGHT
CAR_SPEED = 3
GROG_SIZE = 20

pygame.init()

class Frog:
    def __init__(self):
        self.image = pygame.Surface((GROG_SIZE, GROG_SIZE))
        self.image.fill((0, 255, 0))
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 10
        self.speed = 5

    def handle_input(self, keys):
        if keys[pygame.K_LEFT]:
            self.rect.x -= self.speed
        if keys[pygame.K_RIGHT]:
            self.rect.x += self.speed
        if keys[pygame.K_UP]:
            self.rect.y -= self.speed
        if keys[pygame.K_DOWN]:
            self.rect.y += self.speed
        self.rect.clamp_ip(pygame.Rect(0, 0, WIDTH, HEIGHT))

    def draw(self, surface):
        surface.blit(self.image, self.rect)

class Car:
    def __init__(self, lane, direction=1):
        self.image = pygame.Surface((GROG_SIZE*2, GROG_SIZE))
        self.image.fill((255, 0, 0))
        y = lane * LANE_HEIGHT + (LANE_HEIGHT - GROG_SIZE) // 2
        self.rect = self.image.get_rect(y=y)
        if direction == 1:
            self.rect.x = -self.rect.width
        else:
            self.rect.x = WIDTH
        self.direction = direction

    def update(self):
        self.rect.x += CAR_SPEED * self.direction
        if self.direction == 1 and self.rect.left > WIDTH:
            self.rect.right = 0
        elif self.direction == -1 and self.rect.right < 0:
            self.rect.left = WIDTH

    def draw(self, surface):
        surface.blit(self.image, self.rect)

class Grog:
    def __init__(self):
        self.image = pygame.Surface((GROG_SIZE, GROG_SIZE))
        self.image.fill((0, 0, 255))
        self.rect = self.image.get_rect()
        self.respawn()

    def respawn(self):
        self.rect.x = random.randint(0, WIDTH - GROG_SIZE)
        self.rect.y = random.randint(0, HEIGHT - GROG_SIZE)

    def draw(self, surface):
        surface.blit(self.image, self.rect)


def main():
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    clock = pygame.time.Clock()

    frog = Frog()
    grog = Grog()
    cars = []
    for lane in range(1, NUM_LANES - 1):
        direction = 1 if lane % 2 == 0 else -1
        car = Car(lane, direction)
        cars.append(car)

    fuzziness = 0
    running = True
    while running:
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
        keys = pygame.key.get_pressed()
        frog.handle_input(keys)

        for car in cars:
            car.update()
            if frog.rect.colliderect(car.rect):
                running = False

        if frog.rect.colliderect(grog.rect):
            fuzziness += 1
            grog.respawn()

        surface = pygame.Surface((WIDTH, HEIGHT))
        surface.fill((50, 50, 50))

        grog.draw(surface)
        for car in cars:
            car.draw(surface)
        frog.draw(surface)

        if fuzziness > 0:
            small = pygame.transform.smoothscale(
                surface,
                (max(1, WIDTH // (1 + fuzziness)), max(1, HEIGHT // (1 + fuzziness)))
            )
            surface = pygame.transform.smoothscale(small, (WIDTH, HEIGHT))

        screen.blit(surface, (0, 0))
        pygame.display.flip()
        clock.tick(FPS)

    pygame.quit()

if __name__ == "__main__":
    main()
