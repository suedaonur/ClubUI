import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';
import { PostService, Post } from '../../core/services/post.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  // Servisleri inject ediyoruz
  public authService = inject(AuthService);
  private postService = inject(PostService);
  
  posts: Post[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.loadPosts();
  }

  loadPosts() {
    this.postService.getAllPosts().subscribe({
      next: (data) => {
        // En yeni post en üstte olsun
        this.posts = data.sort((a, b) => new Date(b.createdDate || 0).getTime() - new Date(a.createdDate || 0).getTime());
        this.isLoading = false;
      },
      error: (err) => {
        console.error("Postlar çekilemedi:", err);
        this.isLoading = false;
      }
    });
  }

  onLikePost(postId: number) {
    const user = this.authService.currentUser();
    if (!user) {
      alert("Gönderiyi beğenmek için lütfen önce giriş yapın!");
      return;
    }

    this.postService.likePost(postId, user.id!).subscribe({
      next: () => {
        this.loadPosts();
      },
      error: (err) => {
        console.error("Beğeni eklenemedi", err);
        alert("Bu gönderiyi zaten beğenmiş olabilirsiniz.");
      }
    });
  }

  onCommentPlaceholder() {
    alert("Yorum yapma özelliği çok yakında sizlerle! 💬");
  }
}